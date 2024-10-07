import React from "react";
import styles from "./page-controls.module.sass";
import { PAGE_THRESHOLD } from "../../../definitions";

interface IPageControlsComponentProps {
    onNextClick: () => void;
    onPrevClick: () => void;
    currPage: number;
    pageCount: number;
}

type PageControlsProps = IPageControlsComponentProps & React.HTMLAttributes<HTMLElement>;

export const PageControls: React.FC<PageControlsProps> = (props) => {
    return (
        <div className={styles.page_controls}>
            <button
                disabled={props.currPage === 1}
                className={styles.control}
                onClick={props.onPrevClick}
            >
                Prev
            </button>
            <p>{props.currPage}</p>
            <button
                disabled={props.currPage === props.pageCount * PAGE_THRESHOLD - 1}
                className={styles.control}
                onClick={props.onNextClick}
            >
                Next
            </button>
        </div>
    );
};
