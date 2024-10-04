import React from "react";
import styles from "./movie-item.module.sass";
import { IDiscoverMovieEtry } from "../../../store/global-slice";
import { Link } from "react-router-dom";

interface MovieItemComponentProps {
    entry: IDiscoverMovieEtry;
}

type MovieItemProps = MovieItemComponentProps & React.HTMLAttributes<HTMLElement>;

export const MovieItem: React.FC<MovieItemProps> = (props) => {
    return (
        <li className={[styles.movie_item, "appear"].join(" ")}>
            {/* XXX add space listener for keyboard action */}
            <Link tabIndex={0} to={`/movie/${props.entry.id}`}>
                {props.entry.title}
            </Link>
        </li>
    );
};
