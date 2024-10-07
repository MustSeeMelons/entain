import React, { useCallback, useEffect, useState } from "react";
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
import { ANIMATION_DELAY, DEBOUNCE_AMOUNT, UNLOCK_DELAY } from "../../definitions";
import { searchMoviesCachedPagesSelector } from "../../selectors/global-selectors";

type SearchProps = React.HTMLAttributes<HTMLInputElement>;

export const Search: React.FC<SearchProps> = () => {
    const dispatch = useAppDispatch();
    const searchPage = useAppSelector((state) => state.globalReducer.apiSearchMoviesPage);
    const searchTerm = useAppSelector((state) => state.globalReducer.searchTerm);
    const resultCount = useAppSelector((state) => state.globalReducer.searchItemCount);
    const cachedPages = useAppSelector(searchMoviesCachedPagesSelector);
    const [localTerm, setLocalTerm] = useState("");

    // Keeping our search value while going back & forth
    useEffect(() => {
        setLocalTerm(searchTerm);
    }, []);

    const searchApiCallHandler = useCallback(async (response: Response) => {
        if (response.ok) {
            const data = (await response.json()) as IMovieListResponse;

            setTimeout(() => {
                dispatch(setUiUnlocking(true));
                dispatch(addSearchPageEntries({ page: data.page, entries: data.results }));
                dispatch(
                    setSearchDetails({
                        itemCount: data.total_results,
                        pageCount: data.total_pages,
                    })
                );

                setTimeout(() => {
                    dispatch(setUiLocked(false));
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
                dispatch(setSearchTerm(text));

                appApi.fetchMovieSearch(text, 1, searchApiCallHandler, (_reason) => {
                    dispatch(setError(true));
                });
            } else {
            }
        }, DEBOUNCE_AMOUNT),
        []
    );

    const renderResultCount = () => {
        if (searchTerm) {
            return <p>{resultCount} Results</p>;
        }
    };

    return (
        <div className={styles.search}>
            <p>Search: </p>
            <input
                aria-label="search"
                className={styles.search_input}
                placeholder="for a movie"
                value={localTerm}
                type="text"
                onChange={(e) => {
                    const value = e.target.value;

                    if (value) {
                        setLocalTerm(value);
                        performSearch(value);
                    } else {
                        dispatch(clearSearch());
                        setLocalTerm("");
                        dispatch(setSearchTerm(""));
                    }
                }}
            />
            {renderResultCount()}
        </div>
    );
};
