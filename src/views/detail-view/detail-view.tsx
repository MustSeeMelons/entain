import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { getDiscoverMovies } from "../../selectors/global-selectors";
import styles from "./detail-view.module.sass";
import { useEffect, useState } from "react";
import { IDiscoverMovieEtry } from "../../store/global-slice";

const BACKDROP_PATH = "https://image.tmdb.org/t/p/w780";

export const DetailView = () => {
    const { id } = useParams();

    const movies = useAppSelector(getDiscoverMovies);
    const [movie, setMovie] = useState(() => movies.find((movie) => `${movie.id}` === id));

    // TODO move API stuffs to one place
    useEffect(() => {
        if (!movie) {
            fetch(`https://api.themoviedb.org/3/movie/${id}`, {
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDc4Yzg1MjA2ODU4NWI4NTJiOGNjMGRlY2QyY2ExZiIsIm5iZiI6MTcyNzk0NzQ1Ny43ODMzNTQsInN1YiI6IjY2ZmU0OGQ3Zjg3OGFkZmVkMDg0ZDc0NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WmupLXcsPz97-Svojjjisv99Rfll0GYtmMiPklVzzek",
                },
            }).then(async (response) => {
                if (response.ok) {
                    const data = (await response.json()) as IDiscoverMovieEtry;

                    setMovie(data);
                }
            });
        }
    }, []);

    // TODO show placeholder while we get data

    return (
        <div className={styles.detail_view}>
            <p className={styles.detail_title}>{movie?.title}</p>
            <img className={styles.backdrop} src={`${BACKDROP_PATH}/${movie?.backdrop_path}`} />
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
        </div>
    );
};
