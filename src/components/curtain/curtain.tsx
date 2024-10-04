import React from "react";
import styles from "./curtain.module.sass";
import { Spinner } from "../spinner/spinner";

type CurtainProps = React.HTMLAttributes<HTMLDivElement>;

export const Curtain: React.FC<CurtainProps> = (props) => {
    return (
        // XXX Is there a better way to pass in extra classes to components?
        <div className={[styles.curtain, props.className].join(" ")}>
            <Spinner />
        </div>
    );
};
