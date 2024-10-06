import React from "react";
import styles from "./curtain.module.sass";
import { Spinner } from "../spinner/spinner";

interface ICurtainProps {
    isErr?: boolean;
}

type CurtainProps = ICurtainProps & React.HTMLAttributes<HTMLDivElement>;

export const Curtain: React.FC<CurtainProps> = (props) => {
    return (
        // XXX Is there a better way to pass in extra classes to components?
        <div className={[styles.curtain, props.className].join(" ")}>
            {props.isErr ? (
                <p className={styles.is_err}>Something is a foot, please come back later</p>
            ) : (
                <Spinner />
            )}
        </div>
    );
};
