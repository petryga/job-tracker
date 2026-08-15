import Icon from "@mui/material/Icon";
import styles from "./Form.module.css";
import type { OpenFormProps } from "./types";
import { useSelector } from "react-redux";
import { selectApp } from "reducers/appSlice";

const OpenForm = ({ list, children, onClick }: OpenFormProps) => {
  const { isDragging } = useSelector(selectApp);

  return (
    <div
      className={list ? styles.openFormButtonList : styles.openFormButtonCard}
      onClick={onClick}
    >
      <Icon>{isDragging ? "keyboard_arrow_down" : "add"}</Icon>
      <p className={styles.openFormButtonText}>{children}</p>
    </div>
  );
};

export default OpenForm;
