import React, { useRef } from "react";
import styles from "./item-list.module.sass";
import { useAppSelector } from "../../store/store";
import { getDiscoverMovies } from "../../selectors/global-selectors";
import { MovieItem } from "./movie-item/movie-item";
import { PageControls } from "./page-controls/page-controls";
import { IDiscoverMovieEtry } from "../../store/global-slice";

export const ItemList: React.FC = () => {
    const movies = useAppSelector(getDiscoverMovies);

    const cachedMovies = useRef<IDiscoverMovieEtry[]>([]);

    // Update out cache only if we have movies
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
            <PageControls />
        </>
    );
};
