import { ChangeEvent, Dispatch, FormEvent, MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import styles from "./EditableInput.module.css";
import Icon from "@mui/material/Icon";
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
        .unwrap()
        .then(() => {
          setEditTitle(false);
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Couldn't rename the board");
        });
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
