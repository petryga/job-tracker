import { ModalComponent } from "components/modal/Modal";
import { useSelector } from "react-redux";
import { selectModal } from "reducers/modalSlice";
import { CONFIRM_DELETE, DELETE_BOARD } from "utils/constants";
import useHandleSubmit from "./hooks";
import { useState } from "react";

import styles from "./DeleteModal.module.css";

const style = { height: "200px", marginTop: "300px", width: "550px" };

export const DeleteModal = () => {
  const { modalProps } = useSelector(selectModal);
  const { id: cardID, name } = modalProps || {};
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const title =
    name === DELETE_BOARD
      ? "Delete Board?"
      : cardID
      ? "Delete Card?"
      : "Delete List?";

  const handleSubmit = useHandleSubmit({ setButtonDisabled });

  return (
    <ModalComponent
      name={CONFIRM_DELETE}
      isButtonDisabled={buttonDisabled}
      title={title}
      handleSubmit={handleSubmit}
      stylesWrapper={style}
    >
      <div className={styles.content} />
    </ModalComponent>
  );
};
