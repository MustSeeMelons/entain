import { useEffect } from "react";
import { Header } from "../components/header/header";
import styles from "./app.module.sass";
import { addDiscoverPageEntries, IMovieDbDiscoverResponse } from "../store/global-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Route, Routes } from "react-router-dom";
import { ListView } from "../views/list-view/list-view";
import { DetailView } from "../views/detail-view/detail-view";

// TODO for search functionality `/search/movie`

function App() {
    const appDispatch = useAppDispatch();
    const discoverPage = useAppSelector((state) => state.globalReducer.apiDiscoverMoviesPage);

    // TODO show loader while things are happening

    useEffect(() => {
        // TODO check if we have page in state already
        // TODO where do we store the token?
        // TODO where do we store URL's?
        fetch(`https://api.themoviedb.org/3/discover/movie?page=${discoverPage}`, {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDc4Yzg1MjA2ODU4NWI4NTJiOGNjMGRlY2QyY2ExZiIsIm5iZiI6MTcyNzk0NzQ1Ny43ODMzNTQsInN1YiI6IjY2ZmU0OGQ3Zjg3OGFkZmVkMDg0ZDc0NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WmupLXcsPz97-Svojjjisv99Rfll0GYtmMiPklVzzek",
            },
        }).then(async (response) => {
            if (response.ok) {
                const data = (await response.json()) as IMovieDbDiscoverResponse;

                appDispatch(addDiscoverPageEntries({ page: data.page, entries: data.results }));
                console.log(data);
            } else {
                // TODO show catastrophic error
            }
        });
    }, [discoverPage]);

    return (
        <div className={styles.app}>
            <Header />
            <Routes>
                <Route path="/" element={<ListView />} />
                <Route path="/movie/:id" element={<DetailView />} />
                <Route path="*" element={<div>no u</div>} />
            </Routes>
        </div>
    );
}

export default App;
