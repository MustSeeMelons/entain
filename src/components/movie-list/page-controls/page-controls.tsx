import React from "react";
import styles from "./page-controls.module.sass";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { setOurDiscoverMoviesPage } from "../../../store/global-slice";

type PageControlsProps = React.HTMLAttributes<HTMLElement>;

export const PageControls: React.FC<PageControlsProps> = () => {
    const ourPage = useAppSelector((state) => state.globalReducer.ourDiscoverMoviesPage);
    const dispatch = useAppDispatch();

    // TODO render a few buttons for specific pages

    return (
        <div className={styles.page_controls}>
            <button
                className={styles.control}
                onClick={() => dispatch(setOurDiscoverMoviesPage(ourPage - 1))}
            >
                Prev
            </button>
            <p>{ourPage}</p>
            <button
                className={styles.control}
                onClick={() => dispatch(setOurDiscoverMoviesPage(ourPage + 1))}
            >
                Next
            </button>
        </div>
    );
};
