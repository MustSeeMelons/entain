import React from "react";
import {
    discoverMoviesTotalPageSelector,
    getDiscoverMovies,
    ourDiscoverMoviesPageSelector,
} from "../../selectors/global-selectors";
import { MovieList } from "./movie-list";
import { setOurDiscoverMoviesPage } from "../../store/global-slice";

export const DiscoverMovieList: React.FC = () => {
    return (
        <MovieList
            pageSelector={ourDiscoverMoviesPageSelector}
            pageCountSelector={discoverMoviesTotalPageSelector}
            movieSelector={getDiscoverMovies}
            setPageAction={setOurDiscoverMoviesPage}
        />
    );
};
