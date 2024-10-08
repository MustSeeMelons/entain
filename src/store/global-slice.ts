import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGE_THRESHOLD } from "../definitions";

export interface IDiscoverMovieEtry {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    overview: string;
}

// Works for Discover/Search and perhaps more endpopints that return lists of movies
export interface IMovieListResponse {
    page: number;
    results: IDiscoverMovieEtry[];
    total_pages: number;
    total_results: number;
}

// XXX If this app grows, store full API responses in the state, no reason to split them up into props
export interface IGlobalState {
    isUiLocked: boolean;
    isUiUnlocking: boolean;
    // XXX We could add a expiration time for each entry, probably should
    discoverMovies: { [key: string]: IDiscoverMovieEtry[] };
    discoverMoviesPageCount: number;
    searchMovies: { [key: string]: IDiscoverMovieEtry[] };
    // Can't configure per page on the API, faking it on our end to meet expectations
    apiDiscoverMoviesPage: number;
    ourDiscoverMoviesPage: number;
    apiSearchMoviesPage: number;
    ourSearchMoviesPage: number;
    searchTerm: string;
    searchItemCount: number;
    searchPageCount: number;
    isError: boolean;
}

const initialState: IGlobalState = {
    isUiLocked: true,
    isUiUnlocking: false,
    discoverMovies: {},
    discoverMoviesPageCount: 1,
    searchMovies: {},
    apiDiscoverMoviesPage: 1,
    ourDiscoverMoviesPage: 1,
    apiSearchMoviesPage: 1,
    ourSearchMoviesPage: 1,
    searchTerm: "",
    searchPageCount: 0,
    searchItemCount: 0,
    isError: false,
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setUiLocked: (state: IGlobalState, action: PayloadAction<boolean>) => {
            state.isUiLocked = action.payload;
        },
        setUiUnlocking: (state: IGlobalState, action: PayloadAction<boolean>) => {
            state.isUiUnlocking = action.payload;
        },
        setOurDiscoverMoviesPage: (state: IGlobalState, action: PayloadAction<number>) => {
            const newPage = action.payload;

            // Check if we must change the api counter
            if (newPage > state.ourDiscoverMoviesPage) {
                if (newPage % PAGE_THRESHOLD !== 0) {
                    state.apiDiscoverMoviesPage++;
                }
            } else {
                if (newPage % PAGE_THRESHOLD === 0) {
                    state.apiDiscoverMoviesPage--;
                }
            }

            state.ourDiscoverMoviesPage = action.payload;
        },
        setOurSearchMoviesPage: (state: IGlobalState, action: PayloadAction<number>) => {
            const newPage = action.payload;

            // Check if we must change the api counter
            if (newPage > state.ourSearchMoviesPage) {
                if (newPage % PAGE_THRESHOLD !== 0) {
                    state.apiSearchMoviesPage++;
                }
            } else {
                if (newPage % PAGE_THRESHOLD === 0) {
                    state.apiSearchMoviesPage--;
                }
            }

            state.ourSearchMoviesPage = action.payload;
        },
        addSearchPageEntries: (
            state: IGlobalState,
            action: PayloadAction<{ page?: number; entries?: IDiscoverMovieEtry[] }>
        ) => {
            if (action.payload.page !== undefined) {
                state.searchMovies[action.payload.page] = action.payload.entries ?? [];
            }
        },
        clearSearch: (state) => {
            state.searchMovies = {};
            state.ourSearchMoviesPage = 1;
            state.apiSearchMoviesPage = 1;
            state.searchItemCount = 0;
            state.searchPageCount;
            state.searchTerm = "";
        },
        addDiscoverPageEntries: (
            state: IGlobalState,
            action: PayloadAction<{ page?: number; entries?: IDiscoverMovieEtry[] }>
        ) => {
            if (action.payload.page !== undefined) {
                state.discoverMovies[action.payload.page] = action.payload.entries ?? [];
            }
        },
        setSearchTerm: (state: IGlobalState, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setSearchDetails: (
            state: IGlobalState,
            action: PayloadAction<{ pageCount?: number; itemCount?: number }>
        ) => {
            state.searchItemCount = action.payload.itemCount ?? 0;
            state.searchPageCount = action.payload.pageCount ?? 0;
        },
        setError: (state: IGlobalState, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        setDiscoverDetails: (state: IGlobalState, action: PayloadAction<number>) => {
            state.discoverMoviesPageCount = action.payload;
        },
    },
});

const reducer = globalSlice.reducer;

export const {
    setUiLocked,
    addDiscoverPageEntries,
    setOurDiscoverMoviesPage,
    addSearchPageEntries,
    clearSearch,
    setUiUnlocking,
    setOurSearchMoviesPage,
    setSearchTerm,
    setSearchDetails,
    setError,
    setDiscoverDetails,
} = globalSlice.actions;
export { reducer as globalReducer };
