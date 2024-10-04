import React, { useRef } from "react";
import styles from "./movie-list.module.sass";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getDiscoverMovies, getSearchMovies } from "../../selectors/global-selectors";
import { MovieItem } from "./movie-item/movie-item";
import { PageControls } from "./page-controls/page-controls";
import {
    IDiscoverMovieEtry,
    setOurDiscoverMoviesPage,
    setOurSearchMoviesPage,
} from "../../store/global-slice";

// TODO split into two components, reusing styles
export const MovieList: React.FC = () => {
    const ourDiscoverPage = useAppSelector((state) => state.globalReducer.ourDiscoverMoviesPage);
    const ourSearchPage = useAppSelector((state) => state.globalReducer.ourSearchMoviesPage);
    const dispatch = useAppDispatch();

    const movies = useAppSelector(getDiscoverMovies);
    const searchMovies = useAppSelector(getSearchMovies);

    const isSearchMode = searchMovies.length > 0;

    // Prioritize showhing search
    const moviesToUse = searchMovies.length > 0 ? searchMovies : movies;

    const cachedMovies = useRef<IDiscoverMovieEtry[]>([]);

    // Update our cache only if we have movies, for smoother page switching
    if (moviesToUse.length > 0) {
        cachedMovies.current = moviesToUse;
    }

    return (
        <>
            <ul className={styles.item_list}>
                {cachedMovies.current.map((movie) => {
                    // Using id will make each list item unique between pages, React will thank you
                    return <MovieItem key={`movie-${movie.id}`} entry={movie} />;
                })}
            </ul>
            <PageControls
                currPage={isSearchMode ? ourSearchPage : ourDiscoverPage}
                onPrevClick={() =>
                    dispatch(
                        isSearchMode
                            ? setOurSearchMoviesPage(ourSearchPage - 1)
                            : setOurDiscoverMoviesPage(ourDiscoverPage - 1)
                    )
                }
                onNextClick={() =>
                    dispatch(
                        isSearchMode
                            ? setOurSearchMoviesPage(ourSearchPage + 1)
                            : setOurDiscoverMoviesPage(ourDiscoverPage + 1)
                    )
                }
            />
        </>
    );
};
