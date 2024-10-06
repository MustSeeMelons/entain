import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../store/store";
import { OUR_PER_PAGE } from "../store/global-slice";

export const isUiLockedSelector = createSelector(
    (state: AppState) => state,
    (state) => state.globalReducer.isUiLocked
);

export const ourSearchMoviesPageSelector = createSelector(
    (state: AppState) => state,
    (state) => state.globalReducer.ourSearchMoviesPage
);

export const ourDiscoverMoviesPageSelector = createSelector(
    (state: AppState) => state,
    (state) => state.globalReducer.ourDiscoverMoviesPage
);

export const getDiscoverMovies = createSelector(
    (state: AppState) => state,
    (state) => {
        const ourPage = state.globalReducer.ourDiscoverMoviesPage;
        const apiPage = state.globalReducer.apiDiscoverMoviesPage;

        const apiPageMovies = state.globalReducer.discoverMovies[apiPage] ?? [];

        if (ourPage % 2 === 0) {
            return apiPageMovies.slice(OUR_PER_PAGE);
        } else {
            return apiPageMovies.slice(0, OUR_PER_PAGE);
        }
    }
);

// XXX basically the same as `getDiscoverMovies`, keeping them seperate for easier niche updates on each
// XXX imho some repetition is fine if it is short enough
export const getSearchMovies = createSelector(
    (state: AppState) => state,
    (state) => {
        const ourPage = state.globalReducer.ourSearchMoviesPage;
        const apiPage = state.globalReducer.apiSearchMoviesPage;

        const apiPageMovies = state.globalReducer.searchMovies[apiPage] ?? [];

        if (ourPage % 2 === 0) {
            return apiPageMovies.slice(OUR_PER_PAGE);
        } else {
            return apiPageMovies.slice(0, OUR_PER_PAGE);
        }
    }
);

export const discoverMoviesCachedPagesSelector = createSelector(
    (state: AppState) => state,
    (state) => {
        return Object.keys(state.globalReducer.discoverMovies).reduce<number[]>((acc, curr) => {
            acc.push(+curr);
            return acc;
        }, []);
    }
);

export const searchMoviesCachedPagesSelector = createSelector(
    (state: AppState) => state,
    (state) => {
        return Object.keys(state.globalReducer.searchMovies).reduce<number[]>((acc, curr) => {
            acc.push(+curr);
            return acc;
        }, []);
    }
);

export const isSearchModeSelector = createSelector(
    (state: AppState) => state,
    (state) => {
        return state.globalReducer.searchTerm !== "";
    }
);
