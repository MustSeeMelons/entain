import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Warning: Chaning this wont magically scale, must update `getDiscoverMovies` too!
export const API_PER_PAGE: number = 20;
export const OUR_PER_PAGE: number = 10;

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

export interface IMovieDbDiscoverResponse {
    page: number;
    results: IDiscoverMovieEtry[];
    total_pages: number;
    total_results: number;
}

export interface IGlobalState {
    isUiLocked: boolean;
    // XXX We could add a expiration time for each entry, probably should
    discoverMovies: { [key: string]: IDiscoverMovieEtry[] };
    // Can't configure per page on the API, faking it on our end
    apiDiscoverMoviesPage: number;
    ourDiscoverMoviesPage: number;
}

const initialState: IGlobalState = {
    isUiLocked: true,
    discoverMovies: {},
    apiDiscoverMoviesPage: 1,
    ourDiscoverMoviesPage: 1,
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setUiLocked: (state: IGlobalState, action: PayloadAction<boolean>) => {
            state.isUiLocked = action.payload;
        },
        setOurDiscoverMoviesPage: (state: IGlobalState, action: PayloadAction<number>) => {
            const newPage = action.payload;

            // Check if we must change the api counter
            if (newPage > state.ourDiscoverMoviesPage) {
                if (newPage % (API_PER_PAGE / OUR_PER_PAGE) !== 0) {
                    state.apiDiscoverMoviesPage++;
                }
            } else {
                if (newPage % (API_PER_PAGE / OUR_PER_PAGE) === 0) {
                    state.apiDiscoverMoviesPage--;
                }
            }

            state.ourDiscoverMoviesPage = action.payload;
        },
        // TODO seems it shall be useless
        setApiDiscoverPage: (state: IGlobalState, action: PayloadAction<number>) => {
            state.apiDiscoverMoviesPage = action.payload;
        },
        addDiscoverPageEntries: (
            state: IGlobalState,
            action: PayloadAction<{ page: number; entries: IDiscoverMovieEtry[] }>
        ) => {
            state.discoverMovies[action.payload.page] = action.payload.entries;
        },
    },
});

const reducer = globalSlice.reducer;

export const { setUiLocked, addDiscoverPageEntries, setApiDiscoverPage, setOurDiscoverMoviesPage } =
    globalSlice.actions;
export { reducer as globalReducer };
