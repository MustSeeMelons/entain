import React from "react";
import styles from "./page-controls.module.sass";

interface IPageControlsComponentProps {
    onNextClick: () => void;
    onPrevClick: () => void;
    currPage: number;
}

type PageControlsProps = IPageControlsComponentProps & React.HTMLAttributes<HTMLElement>;

export const PageControls: React.FC<PageControlsProps> = (props) => {
    return (
        <div className={styles.page_controls}>
            <button className={styles.control} onClick={props.onPrevClick}>
                Prev
            </button>
            <p>{props.currPage}</p>
            <button className={styles.control} onClick={props.onNextClick}>
                Next
            </button>
        </div>
    );
};
