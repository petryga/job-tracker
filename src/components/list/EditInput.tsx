import { ChangeEvent, FormEvent } from "react";
import { EditInputProps } from "./types";
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target) {
      (e.target as HTMLInputElement).select();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setListTitle(e.target.value);
  };

  const handleFinishEditing = (e: FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleFinishEditing}>
      <input
        className={styles.styledInput}
        type="text"
        value={listTitle}
        onChange={handleChange}
        autoFocus
        onFocus={handleFocus}
        onBlur={handleFinishEditing}
      />
    </form>
  );
};
