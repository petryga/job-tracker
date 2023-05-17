import { ModalComponent } from "components/modal/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { CREATE_BOARD } from "utils/constants";
import toast from "react-hot-toast";
import { useCreateBoardMutation } from "api/boardApi";
import Button from "@material-ui/core/Button";
import styles from "./Nav.module.css";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { SUGGESTIONS } from "features/homePage/helpers";
import { closeModal } from "reducers/modalSlice";

const style = { height: "450px", marginTop: "150px", width: "550px" };

export const CreateBoardModal = () => {
  const userId = localStorage.getItem("userId");
  const [boardTitle, setBoardTitle] = useState("");
  const [createBoard] = useCreateBoardMutation();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setBoardTitle(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (boardTitle && userId) {
      createBoard({ title: boardTitle, userId })
        .unwrap()
        .then(() => {
          setBoardTitle("");
          dispatch(closeModal());
          toast.success("Board created successfully");
        })
        .catch((error) => toast.error(error.message));
    }
  };

  return (
    <ModalComponent
      name={CREATE_BOARD}
      isButtonDisabled={!boardTitle}
      title={"create a board"}
      handleSubmit={handleSubmit}
      stylesWrapper={style}
      secondaryAction={{
        hide: true,
      }}
    >
      <div className={styles.modalContainer}>
        <form className={styles.inputContainer} onSubmit={handleSubmit}>
          <TextField
            name="boardTitle"
            margin="dense"
            InputLabelProps={{ shrink: true }}
            className={styles.createInput}
            onChange={handleChange}
            value={boardTitle}
            type="text"
            variant="outlined"
            label="Board name"
            autoFocus
            InputProps={
              boardTitle
                ? {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        onClick={() => setBoardTitle("")}
                        className={styles.clearIcon}
                      >
                        <Icon fontSize="small">clear</Icon>
                      </InputAdornment>
                    ),
                  }
                : undefined
            }
          />
        </form>

        <div className={styles.suggestions}>
          {SUGGESTIONS.map(({ id, text, icon }) => (
            <Button
              key={id}
              onClick={() => {
                setBoardTitle(text);
              }}
            >
              {text} {icon}
            </Button>
          ))}
        </div>
      </div>
    </ModalComponent>
  );
};
