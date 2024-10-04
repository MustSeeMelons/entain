import React from "react";
import { getSearchMovies, ourSearchMoviesPageSelector } from "../../selectors/global-selectors";
import { setOurSearchMoviesPage } from "../../store/global-slice";
import { MovieList } from "./movie-list";

export const SearchMovieList: React.FC = () => {
    return (
        <MovieList
            pageSelector={ourSearchMoviesPageSelector}
            movieSelector={getSearchMovies}
            setPageAction={setOurSearchMoviesPage}
        />
    );
};
