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
    addCard,
  }: FormProps) => {
    const { isJobSearchBoard } = board;
    const placeholder = getPlaceholder(list, isJobSearchBoard);

    const handleFocus = (e: FocusEvent) => {
      if (e.target) {
        (e.target as HTMLInputElement).select();
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (isJobSearchBoard && addCard && e.key === "Enter") {
        addCard();
        closeForm();
      }
    };

    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Textarea
            className={styles.textarea}
            placeholder={placeholder}
            autoFocus
            onFocus={handleFocus}
            value={text}
            onChange={onChange}
            onBlur={closeForm}
            onKeyPress={handleKeyPress}
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
