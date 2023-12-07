import { memo } from "react";
import Icon from "@material-ui/core/Icon";
import Textarea from "react-textarea-autosize";
import Card from "@material-ui/core/Card";
import styles from "./Form.module.css";
import { FormProps } from "./types";
import { getPlaceholder } from "./helpers";

const Form = memo(
  ({
    list = false,
    text = "",
    onChange,
    closeForm,
    children,
    board,
    handleKeyPress,
  }: FormProps) => {
    const { isJobSearchBoard } = board;
    const placeholder = getPlaceholder(list, isJobSearchBoard);

    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Textarea
            className={styles.textarea}
            placeholder={placeholder}
            autoFocus
            value={text}
            onChange={onChange}
            onBlur={closeForm}
            onKeyDown={handleKeyPress}
          />
        </Card>
        <div className={styles.buttonContainer}>
          {children}
          <Icon className={styles.styledIcon} onMouseDown={closeForm}>
            close
          </Icon>
        </div>
      </div>
    );
  }
);

export default Form;
