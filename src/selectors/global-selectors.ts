import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../store/store";
import { OUR_PER_PAGE } from "../store/global-slice";

export const isUiLockedSelector = createSelector(
    (state: AppState) => state,
    (state) => state.globalReducer.isUiLocked
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
