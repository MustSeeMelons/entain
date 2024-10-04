import React from "react";
import { getDiscoverMovies, ourDiscoverMoviesPageSelector } from "../../selectors/global-selectors";
import { MovieList } from "./movie-list";
import { setOurDiscoverMoviesPage } from "../../store/global-slice";

export const DiscoverMovieList: React.FC = () => {
    return (
        <MovieList
            pageSelector={ourDiscoverMoviesPageSelector}
            movieSelector={getDiscoverMovies}
            setPageAction={setOurDiscoverMoviesPage}
        />
    );
};
