import React from "react";
import styles from "./spinner.module.sass";
import "../../variables.sass";

type SpinnerProps = React.HTMLAttributes<HTMLElement>;

export const Spinner: React.FC<SpinnerProps> = (props) => {
    return (
        <div className={[styles.spin_container, props.className].filter((c) => c!!).join(" ")}>
            <div className={styles.spinner} />
        </div>
    );
};
