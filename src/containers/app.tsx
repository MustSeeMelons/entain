import { useEffect } from "react";
import { Header } from "../components/header/header";
import styles from "./app.module.sass";
import {
    addDiscoverPageEntries,
    IMovieListResponse,
    setUiLocked,
    setUiUnlocking,
} from "../store/global-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Route, Routes } from "react-router-dom";
import { ListView } from "../views/list-view/list-view";
import { DetailView } from "../views/detail-view/detail-view";
import { appApi } from "../api";
import { isUiLockedSelector } from "../selectors/global-selectors";
import { Curtain } from "../components/curtain/curtain";
import { UNLOCK_DELAY } from "../definitions";

function App() {
    const dispatch = useAppDispatch();
    const isUiLocked = useAppSelector(isUiLockedSelector);
    const isUiUnlocking = useAppSelector((state) => state.globalReducer.isUiUnlocking);
    const discoverPage = useAppSelector((state) => state.globalReducer.apiDiscoverMoviesPage);

    useEffect(() => {
        // TODO check if we have page in state already

        dispatch(setUiLocked(true));

        appApi.fetchDiscoverMovies(
            discoverPage,
            async (response: Response) => {
                if (response.ok) {
                    const data = (await response.json()) as IMovieListResponse;

                    dispatch(setUiUnlocking(true));
                    dispatch(addDiscoverPageEntries({ page: data.page, entries: data.results }));

                    setTimeout(() => {
                        dispatch(setUiLocked(false));
                        dispatch(setUiUnlocking(false));
                    }, UNLOCK_DELAY);
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
            {isUiLocked && <Curtain className={isUiUnlocking ? "disappear" : ""} />}
            <Routes>
                <Route path="/" element={<ListView />} />
                <Route path="/movie/:id" element={<DetailView />} />
                <Route path="*" element={<div>no u</div>} />
            </Routes>
        </div>
    );
}

export default App;
