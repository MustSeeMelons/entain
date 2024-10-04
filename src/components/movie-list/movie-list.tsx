import React, { useRef } from "react";
import styles from "./movie-list.module.sass";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { MovieItem } from "./movie-item/movie-item";
import { PageControls } from "./page-controls/page-controls";
import { IDiscoverMovieEtry, IGlobalState } from "../../store/global-slice";

type MoviePageSelector = (state: { globalReducer: IGlobalState }) => number;
type MovieSelector = (state: { globalReducer: IGlobalState }) => IDiscoverMovieEtry[];

interface ISearchMovieListComponentProps {
    pageSelector: MoviePageSelector;
    movieSelector: MovieSelector;
    setPageAction: (payload: number) => {
        payload: number;
        type: string;
    };
}

// Renders a list of movies from the provided data source functions
export const MovieList: React.FC<ISearchMovieListComponentProps> = (props) => {
    // XXX if this approach turns out constraining, we can always package the logic into a hook and have
    // XXX seperate `render` components instead
    const page = useAppSelector(props.pageSelector);
    const dispatch = useAppDispatch();

    const movies = useAppSelector(props.movieSelector);

    const cachedMovies = useRef<IDiscoverMovieEtry[]>([]);

    // Update our cache only if we have movies, for smoother page switching
    if (movies.length > 0) {
        cachedMovies.current = movies;
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
                currPage={page}
                onPrevClick={() => dispatch(props.setPageAction(page - 1))}
                onNextClick={() => dispatch(props.setPageAction(page + 1))}
            />
        </>
    );
};
