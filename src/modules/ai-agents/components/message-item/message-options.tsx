import { GoUnmute } from "react-icons/go";
import { BiCopy } from "react-icons/bi";
import { FaArrowsRotate } from "react-icons/fa6";
import { FiThumbsDown } from "react-icons/fi";

import styles from "./index.module.css";
import { Swap } from "../swap";

export const MessageOptions = () => {
    return (
        <>
        <div className={styles.messageOptions}>
            <GoUnmute size={18}/>
            <BiCopy size={18}/>
            <FaArrowsRotate size={18}/>
            <FiThumbsDown size={18}/>
        </div>
        {/* <Swap /> */}
        </>
    )
}