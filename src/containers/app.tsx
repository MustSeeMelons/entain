import { useEffect } from "react";
import { Header } from "../components/header/header";
import styles from "./app.module.sass";
import {
    addDiscoverPageEntries,
    IMovieListResponse,
    setError,
    setUiLocked,
    setUiUnlocking,
} from "../store/global-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Route, Routes } from "react-router-dom";
import { ListView } from "../views/list-view/list-view";
import { DetailView } from "../views/detail-view/detail-view";
import { appApi } from "../api";
import {
    discoverMoviesCachedPagesSelector,
    isUiLockedSelector,
} from "../selectors/global-selectors";
import { Curtain } from "../components/curtain/curtain";
import { ANIMATION_DELAY, UNLOCK_DELAY } from "../definitions";

function App() {
    const dispatch = useAppDispatch();
    const isUiLocked = useAppSelector(isUiLockedSelector);
    const isUiUnlocking = useAppSelector((state) => state.globalReducer.isUiUnlocking);
    const discoverPage = useAppSelector((state) => state.globalReducer.apiDiscoverMoviesPage);
    const cachedPages = useAppSelector(discoverMoviesCachedPagesSelector);
    const isErr = useAppSelector((state) => state.globalReducer.isError);

    useEffect(() => {
        let timeRef: NodeJS.Timeout;

        if (cachedPages.indexOf(discoverPage) !== -1) {
            return;
        }

        dispatch(setUiLocked(true));

        appApi.fetchDiscoverMovies(
            discoverPage,
            async (response: Response) => {
                if (response.ok) {
                    const data = (await response.json()) as IMovieListResponse;

                    timeRef = setTimeout(() => {
                        dispatch(setUiUnlocking(true));
                        dispatch(
                            addDiscoverPageEntries({ page: data.page, entries: data.results })
                        );

                        timeRef = setTimeout(() => {
                            dispatch(setUiLocked(false));
                            dispatch(setUiUnlocking(false));
                        }, ANIMATION_DELAY);
                    }, UNLOCK_DELAY);
                } else {
                    dispatch(setError(true));
                }
            },
            (_reason) => {
                dispatch(setError(true));
            }
        );

        return () => {
            clearTimeout(timeRef);
        };
    }, [discoverPage]);

    return (
        <div className={styles.app}>
            <Header />
            {isUiLocked && <Curtain isErr={isErr} className={isUiUnlocking ? "disappear" : ""} />}
            <Routes>
                <Route path="/" element={<ListView />} />
                <Route path="/movie/:id" element={<DetailView />} />
                <Route path="*" element={<div>no u</div>} />
            </Routes>
        </div>
    );
}

export default App;
