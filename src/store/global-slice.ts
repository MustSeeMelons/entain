import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Warning: Chaning this wont magically scale, must update `getDiscoverMovies` too!
export const API_PER_PAGE: number = 20;
export const OUR_PER_PAGE: number = 10;

const PAGE_THRESHOLD = API_PER_PAGE / OUR_PER_PAGE;

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

export interface IGlobalState {
    isUiLocked: boolean;
    isUiUnlocking: boolean;
    // XXX We could add a expiration time for each entry, probably should
    discoverMovies: { [key: string]: IDiscoverMovieEtry[] };
    searchMovies: { [key: string]: IDiscoverMovieEtry[] };
    // Can't configure per page on the API, faking it on our end to meet expectations
    apiDiscoverMoviesPage: number;
    ourDiscoverMoviesPage: number;
    apiSearchMoviesPage: number;
    ourSearchMoviesPage: number;
    searchTerm: string;
    searchItemCount: number;
    searchPageCount: number;
}

const initialState: IGlobalState = {
    isUiLocked: true,
    isUiUnlocking: false,
    discoverMovies: {},
    searchMovies: {},
    apiDiscoverMoviesPage: 1,
    ourDiscoverMoviesPage: 1,
    apiSearchMoviesPage: 1,
    ourSearchMoviesPage: 1,
    searchTerm: "",
    searchPageCount: 0,
    searchItemCount: 0,
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
            action: PayloadAction<{ page: number; entries: IDiscoverMovieEtry[] }>
        ) => {
            state.searchMovies[action.payload.page] = action.payload.entries;
        },
        clearSearch: (state) => {
            state.searchMovies = {};
            state.ourSearchMoviesPage = 1;
            state.apiSearchMoviesPage = 1;
            state.searchTerm = "";
        },
        addDiscoverPageEntries: (
            state: IGlobalState,
            action: PayloadAction<{ page: number; entries: IDiscoverMovieEtry[] }>
        ) => {
            state.discoverMovies[action.payload.page] = action.payload.entries;
        },
        setSearchTerm: (state: IGlobalState, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setSearchDetails: (
            state: IGlobalState,
            action: PayloadAction<{ pageCount: number; itemCount: number }>
        ) => {
            state.searchItemCount = action.payload.itemCount;
            state.searchPageCount = action.payload.pageCount;
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
} = globalSlice.actions;
export { reducer as globalReducer };
