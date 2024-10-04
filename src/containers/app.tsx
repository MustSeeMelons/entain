import { useEffect } from "react";
import { Header } from "../components/header/header";
import styles from "./app.module.sass";
import { addDiscoverPageEntries, IMovieDbDiscoverResponse } from "../store/global-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Route, Routes } from "react-router-dom";
import { ListView } from "../views/list-view/list-view";
import { DetailView } from "../views/detail-view/detail-view";
import { appApi } from "../api";

// TODO for search functionality `/search/movie`

function App() {
    const appDispatch = useAppDispatch();
    const discoverPage = useAppSelector((state) => state.globalReducer.apiDiscoverMoviesPage);

    // TODO show loader while things are happening

    useEffect(() => {
        // TODO check if we have page in state already

        appApi.fetchDiscoverMovies(
            discoverPage,
            async (response: Response) => {
                if (response.ok) {
                    const data = (await response.json()) as IMovieDbDiscoverResponse;

                    appDispatch(addDiscoverPageEntries({ page: data.page, entries: data.results }));
                } else {
                    // TODO show catastrophic error
                }
            },
            (_reason) => {
                // TODO show catastrophic error
            }
        );
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
