import { ChangeEvent, KeyboardEvent } from "react";
import type { EditInputProps } from "./types";
import { useUpdateListMutation } from "api/boardApi";
import styles from "./List.module.css";
import { toast } from "react-hot-toast";

export const EditInput = ({
  setListTitle,
  setIsEditing,
  listID,
  listTitle,
  boardID,
  title,
}: EditInputProps) => {
  const [updateList] = useUpdateListMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setListTitle(e.target.value);
  };

  const handleFinishEditing = () => {
    if (listID && listTitle && boardID && listTitle !== title) {
      updateList({ id: listID, boardID, title: listTitle })
        .unwrap()
        .then((res) => {
          setIsEditing(false);
          toast.success(res.message);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
    if (listTitle === title) {
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFinishEditing();
    }
  };

  return (
    <form onSubmit={handleFinishEditing}>
      <input
        className={styles.styledInput}
        type="text"
        value={listTitle}
        onChange={handleChange}
        autoFocus
        onBlur={handleFinishEditing}
        onKeyDown={handleKeyPress}
      />
    </form>
  );
};
