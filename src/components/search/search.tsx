import React, { useCallback, useEffect } from "react";
import styles from "./search.module.sass";
import debounce from "lodash.debounce";
import { appApi } from "../../api";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
    addSearchPageEntries,
    clearSearch,
    IMovieListResponse,
    setSearchDetails,
    setSearchTerm,
    setUiLocked,
    setUiUnlocking,
} from "../../store/global-slice";
import { UNLOCK_DELAY } from "../../definitions";

type SearchProps = React.HTMLAttributes<HTMLInputElement>;

export const Search: React.FC<SearchProps> = () => {
    const dispatch = useAppDispatch();
    const searchPage = useAppSelector((state) => state.globalReducer.apiSearchMoviesPage);
    const searchTerm = useAppSelector((state) => state.globalReducer.searchTerm);
    const resultCount = useAppSelector((state) => state.globalReducer.searchItemCount);

    // TODO extract into response handler
    useEffect(() => {
        dispatch(setUiLocked(true));

        appApi.fetchMovieSearch(
            searchTerm,
            searchPage,
            async (response) => {
                if (response.ok) {
                    const data = (await response.json()) as IMovieListResponse;

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
                    }, UNLOCK_DELAY);
                }
            },
            (_reason) => {}
        );
    }, [searchPage]);

    const performSearch = useCallback(
        debounce((text: string) => {
            dispatch(setUiLocked(true));

            appApi.fetchMovieSearch(
                text,
                1,
                async (response: Response) => {
                    if (response.ok) {
                        const data = (await response.json()) as IMovieListResponse;

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
                        }, UNLOCK_DELAY);
                    }
                },
                (_reason) => {
                    // TODO show error
                }
            );
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
