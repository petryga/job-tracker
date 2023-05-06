import Icon from "@material-ui/core/Icon";
import styles from "./Form.module.css";
import { OpenFormProps } from "./types";

const OpenForm = ({ list, children, onClick }: OpenFormProps) => {
  return (
    <div
      className={list ? styles.openFormButtonList : styles.openFormButtonCard}
      onClick={onClick}
    >
      <Icon>add</Icon>
      <p className={styles.openFormButtonText}>{children}</p>
    </div>
  );
};

export default OpenForm;
