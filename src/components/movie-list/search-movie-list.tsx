import React from "react";
import {
    getSearchMovies,
    ourSearchMoviesPageSelector,
    searchMoviesTotalPageSelector,
} from "../../selectors/global-selectors";
import { setOurSearchMoviesPage } from "../../store/global-slice";
import { MovieList } from "./movie-list";

export const SearchMovieList: React.FC = () => {
    return (
        <MovieList
            pageSelector={ourSearchMoviesPageSelector}
            pageCountSelector={searchMoviesTotalPageSelector}
            movieSelector={getSearchMovies}
            setPageAction={setOurSearchMoviesPage}
        />
    );
};
