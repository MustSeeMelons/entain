import React from "react";
import { describe, it, expect, vi, beforeAll, afterEach, afterAll, beforeEach } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/containers/app";
import {
    createMovie,
    pageMovieTitles,
    renderWithProviders,
    searchMovieTitles,
    wait,
} from "../test-utils";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { IMovieListResponse, OUR_PER_PAGE } from "../../src/store/global-slice";
import userEvent from "@testing-library/user-event";
import { ANIMATION_DELAY, DEBOUNCE_AMOUNT, UNLOCK_DELAY } from "../../src/definitions";

const LOAD_DELAY = UNLOCK_DELAY + ANIMATION_DELAY;

const server = setupServer(
    http.get("https://api.themoviedb.org/3/discover/movie", ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get("page");

        const response: IMovieListResponse = {
            page: page ? +page : 1,
            results: pageMovieTitles[page ? +page - 1 : 1].map(createMovie),
            total_pages: pageMovieTitles.length,
            total_results: 40,
        };

        return HttpResponse.json(response);
    }),
    http.get("https://api.themoviedb.org/3/movie/:id", ({ params }) => {
        const { id } = params;

        return HttpResponse.json(createMovie(pageMovieTitles[1][id as string], +id));
    }),
    http.get("https://api.themoviedb.org/3/search/movie", ({ request }) => {
        // This call also has a `text` property, but we are not testing the API, but the rendering flow
        const url = new URL(request.url);
        const page = url.searchParams.get("page");

        const response: IMovieListResponse = {
            page: page ? +page : 1,
            results: searchMovieTitles[page ? +page - 1 : 1].map(createMovie),
            total_pages: searchMovieTitles.length,
            total_results: 42,
        };

        return HttpResponse.json(response);
    })
);

const getMappedLinks = () => {
    return screen.getAllByRole("link").map((el) => el.textContent) as string[];
};

describe("flow tests", () => {
    beforeAll(() => server.listen());

    afterEach(() => {
        server.resetHandlers();
        cleanup();
    });

    afterAll(() => server.close());

    it("general app load, discover render", async () => {
        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        const divElement = document.querySelector('div[class*="curtain"]');
        expect(divElement).toBeInTheDocument();

        await wait(LOAD_DELAY);

        const links = screen.getAllByRole("link");

        expect(links.length).toBe(OUR_PER_PAGE);
        expect(links.some((link) => link.getAttribute("href") === "/movie/7"));
    });

    it("aps is down, global err message is shown", async () => {
        server.use(
            http.get("https://api.themoviedb.org/3/discover/movie", () => {
                return new HttpResponse("Expected error", { status: 500 });
            })
        );

        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await wait(LOAD_DELAY);

        const divElement = document.querySelector('p[class*="is_err"]');

        expect(divElement).toBeInTheDocument();
    });

    it("general pagination", async () => {
        const user = userEvent.setup();

        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await wait(LOAD_DELAY);

        const butttonNext = screen.getByRole("button", { name: /next/i });

        // We have the first 10 results of api call 1
        const pageOneLinks = getMappedLinks();
        expect(pageOneLinks).toEqual(pageMovieTitles[0].slice(0, OUR_PER_PAGE));

        await user.click(butttonNext);

        // We have the second 10 results of api call 1
        let pageTwoLinks = getMappedLinks();
        expect(pageTwoLinks).toEqual(pageMovieTitles[0].slice(OUR_PER_PAGE));

        await user.click(butttonNext);

        await wait(LOAD_DELAY);

        // We have the first 10 results of api call 2
        const pageThreeLinks = getMappedLinks();
        expect(pageThreeLinks).toEqual(pageMovieTitles[1].slice(0, OUR_PER_PAGE));

        await user.click(screen.getByRole("button", { name: /prev/i }));

        // Going back should equal second half of first API call with only animation time delay
        await wait(ANIMATION_DELAY);

        pageTwoLinks = getMappedLinks();
        expect(pageTwoLinks).toEqual(pageMovieTitles[0].slice(OUR_PER_PAGE));
    });

    it("click on movie shows us movie details", async () => {
        const user = userEvent.setup();

        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await wait(LOAD_DELAY);

        await user.click(screen.getAllByRole("link")[0]);

        const title = await screen.getByText(pageMovieTitles[0][0]);
        expect(title).toBeInTheDocument();
    });

    it("empty discover page", async () => {
        server.use(
            http.get("https://api.themoviedb.org/3/discover/movie", () => {
                return HttpResponse.json({ page: 1, results: [] });
            })
        );

        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Extra delay so controls are unlocked for message to show
        await wait(LOAD_DELAY + 100);

        const message = await screen.getByText(/no movies/i);
        expect(message).toBeInTheDocument();
    });

    it("search renders a their list", async () => {
        const user = userEvent.setup();

        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await wait(LOAD_DELAY);

        const searchField = screen.getByRole("textbox");
        user.type(searchField, "prompt");

        await wait(DEBOUNCE_AMOUNT + LOAD_DELAY + 200);

        const links = getMappedLinks();

        expect(links.length).toBe(OUR_PER_PAGE);
        expect(links.some((link) => link === searchMovieTitles[0][0])).toBeTruthy();
    });

    it("search pagination works", async () => {
        const user = userEvent.setup();

        renderWithProviders(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await wait(LOAD_DELAY);

        const searchField = screen.getByRole("textbox");
        user.type(searchField, "prompt");

        await wait(DEBOUNCE_AMOUNT + LOAD_DELAY + 200);

        const butttonNext = screen.getByRole("button", { name: /next/i });

        // We have the first 10 results of api call 1
        const pageOneLinks = getMappedLinks();
        expect(pageOneLinks).toEqual(searchMovieTitles[0].slice(0, OUR_PER_PAGE));

        await user.click(butttonNext);

        // We have the second 10 results of api call 1
        let pageTwoLinks = getMappedLinks();
        expect(pageTwoLinks).toEqual(searchMovieTitles[0].slice(OUR_PER_PAGE));

        await user.click(butttonNext);

        await wait(LOAD_DELAY);

        // We have the first 10 results of api call 2
        const pageThreeLinks = getMappedLinks();
        expect(pageThreeLinks).toEqual(searchMovieTitles[1].slice(0, OUR_PER_PAGE));

        await user.click(screen.getByRole("button", { name: /prev/i }));

        // Going back should equal second half of first API call with only animation time delay
        await wait(ANIMATION_DELAY);

        pageTwoLinks = getMappedLinks();
        expect(pageTwoLinks).toEqual(searchMovieTitles[0].slice(OUR_PER_PAGE));
    });
});
