import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { globalReducer, IDiscoverMovieEtry } from "../src/store/global-slice";
import { vi } from "vitest";

// From the Redux docs
export const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = configureStore({
            reducer: { globalReducer },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) => {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }

    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const createMovie = (title: string, index: number): IDiscoverMovieEtry => {
    return {
        adult: false,
        backdrop_path: "",
        genre_ids: [],
        id: index,
        original_language: "",
        original_title: title,
        overview: "",
        popularity: 1,
        poster_path: "",
        release_date: "",
        title: title,
        video: false,
        vote_average: 0,
        vote_count: 1,
    };
};

export const wait = async (time: number) => {
    return vi.waitFor(
        () =>
            new Promise<void>((resolve) => {
                setTimeout(() => resolve(), time);
            }),
        { timeout: 5000 }
    );
};

export const pageMovieTitles: string[][] = [
    [
        "Whispers in the Fog",
        "The Last Voyage of the Starship",
        "Echoes of Tomorrow",
        "Beneath the Silver Sky",
        "The Secret of the Lost Realm",
        "A Dance with Shadows",
        "The Timekeeper's Dilemma",
        "Journey to the Heart of Time",
        "Fires of Redemption",
        "The Clockmaker's Daughter",
        "Starlit Dreams",
        "Mysteries of the Ancient Forest",
        "Forgotten Tales",
        "The Hidden Truth",
        "Adventures in the Ether",
        "The Enchanted Garden",
        "Rise of the Crimson Phoenix",
        "The Lost Chronicles",
        "A Symphony of Stars",
        "Legends of the Forgotten Realm",
    ],
    [
        "Shadows of the Past",
        "The Forgotten Hero",
        "Whirlwind of Dreams",
        "The Keeper of Secrets",
        "Voices in the Mist",
        "The Last Light",
        "Chronicles of the Unseen",
        "The Phantom's Lament",
        "The Edge of Infinity",
        "The Crystal of Destiny",
        "Beyond the Horizon",
        "Fragments of Eternity",
        "The Whispering Woods",
        "Labyrinth of Illusions",
        "Heart of the Storm",
        "The Serpent's Song",
        "Tales from the Abyss",
        "A Flicker in Time",
        "The Relic Hunter",
        "Winds of Change",
    ],
];

export const searchMovieTitles: string[][] = [
    [
        "Shadows of Tomorrow",
        "Midnight Mirage",
        "Echoes of Infinity",
        "The Forgotten Kingdom",
        "Neon Dreams",
        "Whispers in the Dark",
        "Eternal Horizon",
        "Crimson Skies",
        "The Last Horizon",
        "Beyond the Abyss",
        "Silver Lining Chronicles",
        "Quantum Shift",
        "Mystic Revolt",
        "The Silent Revolution",
        "Edge of Destiny",
        "Celestial Voyage",
        "The Phantom Reign",
        "Oblivion's Gate",
        "Galactic Drift",
        "Time's Forgotten Echo",
    ],
    [
        "Voyage of the Fallen Star",
        "The Glass Labyrinth",
        "Winds of Tomorrow",
        "Shadow Over the Empire",
        "The Moonlit Enigma",
        "Silent Thunder",
        "Lost in the Cosmos",
        "Empire of Ashes",
        "The Arcane Symphony",
        "Rift Between Worlds",
        "Serenade of Shadows",
        "The Neon Crusade",
        "Frozen in Time",
        "Dark Waters Rising",
        "The Vanishing Horizon",
        "Ghosts of the Frontier",
        "Storms of the Wasteland",
        "The Eternal Pulse",
        "The Forgotten Odyssey",
        "The Obsidian Veil",
    ],
];
