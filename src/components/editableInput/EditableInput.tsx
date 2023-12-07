import { ChangeEvent, Dispatch, FormEvent, MouseEvent, useState } from "react";
import styles from "./EditableInput.module.css";
import Icon from "@material-ui/core/Icon";
import { useUpdateBoardMutation } from "api/boardApi";
import type { BoardApi } from "features/boardPage/types";

export const EditableInput = ({
  board,
  setEditTitle,
}: {
  board: BoardApi;
  setEditTitle: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { _id: id, title } = board;
  const [boardTitle, setBoardTitle] = useState(title);
  const [updateBoard] = useUpdateBoardMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setBoardTitle(e.target.value);
  };

  const handleUpdateTitle = (
    e: MouseEvent<HTMLSpanElement> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (id && boardTitle) {
      updateBoard({ id, data: { title: boardTitle } })
        .then(() => {
          setEditTitle(false);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleUpdateTitle}>
      <input
        className={styles.styledInput}
        type="text"
        value={boardTitle}
        onChange={handleChange}
      />

      <Icon className={styles.checkIcon} onClick={handleUpdateTitle}>
        check
      </Icon>
    </form>
  );
};
