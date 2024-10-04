import React, { useCallback, useEffect } from "react";
import styles from "./search.module.sass";
import debounce from "lodash.debounce";
import { appApi } from "../../api";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
    addSearchPageEntries,
    clearSearch,
    IMovieListResponse,
    setError,
    setSearchDetails,
    setSearchTerm,
    setUiLocked,
    setUiUnlocking,
} from "../../store/global-slice";
import { ANIMATION_DELAY, UNLOCK_DELAY } from "../../definitions";
import { searchMoviesCachedPagesSelector } from "../../selectors/global-selectors";

type SearchProps = React.HTMLAttributes<HTMLInputElement>;

export const Search: React.FC<SearchProps> = () => {
    const dispatch = useAppDispatch();
    const searchPage = useAppSelector((state) => state.globalReducer.apiSearchMoviesPage);
    const searchTerm = useAppSelector((state) => state.globalReducer.searchTerm);
    const resultCount = useAppSelector((state) => state.globalReducer.searchItemCount);
    const cachedPages = useAppSelector(searchMoviesCachedPagesSelector);

    const searchApiCallHandler = useCallback(async (response: Response) => {
        if (response.ok) {
            const data = (await response.json()) as IMovieListResponse;

            setTimeout(() => {
                dispatch(setUiUnlocking(true));
                dispatch(addSearchPageEntries({ page: data.page, entries: data.results }));

                setTimeout(() => {
                    dispatch(setUiLocked(false));
                    dispatch(
                        setSearchDetails({
                            itemCount: data.total_results,
                            pageCount: data.total_pages,
                        })
                    );
                    dispatch(setUiUnlocking(false));
                }, ANIMATION_DELAY);
            }, UNLOCK_DELAY);
        }
    }, []);

    useEffect(() => {
        if (cachedPages.indexOf(searchPage) !== -1) {
            return;
        }

        if (searchTerm) {
            dispatch(setUiLocked(true));

            appApi.fetchMovieSearch(searchTerm, searchPage, searchApiCallHandler, (_reason) => {
                setError(true);
            });
        }
    }, [searchPage]);

    const performSearch = useCallback(
        debounce((text: string) => {
            if (text) {
                dispatch(setUiLocked(true));

                appApi.fetchMovieSearch(text, 1, searchApiCallHandler, (_reason) => {
                    dispatch(setError(true));
                });
            }
        }, 300),
        []
    );

    return (
        <div className={styles.search}>
            <p>Search: </p>
            <input
                className={styles.search_input}
                placeholder="for a movie"
                value={searchTerm}
                onChange={(e) => {
                    const value = e.target.value;

                    if (value) {
                        dispatch(setSearchTerm(value));
                        performSearch(e.target.value);
                    } else {
                        dispatch(clearSearch());
                    }
                }}
            />
            {searchTerm && <p>{resultCount} Results</p>}
        </div>
    );
};
