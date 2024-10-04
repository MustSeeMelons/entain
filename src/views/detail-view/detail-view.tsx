import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { getDiscoverMovies } from "../../selectors/global-selectors";
import styles from "./detail-view.module.sass";
import { useEffect, useState } from "react";
import { IDiscoverMovieEtry } from "../../store/global-slice";
import { appApi } from "../../api";
import { Spinner } from "../../components/spinner/spinner";

const BACKDROP_PATH = "https://image.tmdb.org/t/p/w780";

export const DetailView = () => {
    let { id } = useParams();

    const movies = useAppSelector(getDiscoverMovies);
    const [movie, setMovie] = useState(() => movies.find((movie) => `${movie.id}ss` === id));

    useEffect(() => {
        if (!movie) {
            appApi.fetchMovieDetails(
                id ?? "",
                async (response: Response) => {
                    // XXX direct response checking could be moved in to the api so that it only callbacks the success results
                    if (response.ok) {
                        const data = (await response.json()) as IDiscoverMovieEtry;

                        setMovie(data);
                    }
                },
                () => {}
            );
        }
    }, []);

    return (
        <div className={styles.detail_view}>
            {!movie ? (
                <Spinner className={styles.bigger_spinner} />
            ) : (
                <>
                    <p className={styles.detail_title}>{movie?.title}</p>
                    <img
                        className={styles.backdrop}
                        src={`${BACKDROP_PATH}/${movie?.backdrop_path}`}
                    />
                    <div className={styles.overview}>
                        <p>{movie?.overview}</p>
                    </div>
                    <div className={styles.properties}>
                        <p>
                            Released: <b>{movie?.release_date}</b>
                        </p>
                        <p>
                            Rating: <b>{movie?.vote_average.toFixed(2)}/10</b>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
