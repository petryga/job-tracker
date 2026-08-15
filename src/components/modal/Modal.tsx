import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, selectModal } from "reducers/modalSlice";
import type { ModalProps } from "./types";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import styles from "./Modal.module.css";

export const ModalComponent = ({
  title,
  children,
  isButtonDisabled = false,
  name,
  onClose,
  handleSubmit,
  secondaryAction = { hide: true },
  stylesWrapper,
  hideSecondaryButton = false,
  primaryButtonText = "Submit",
}: ModalProps) => {
  const { openModal } = useSelector(selectModal);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }

    if (openModal !== null && openModal === name) {
      dispatch(closeModal());
    }
  };

  const handleSecondaryAction = () => {
    if (secondaryAction.onSecondaryAction) {
      secondaryAction.onSecondaryAction();
    }
    handleCloseModal();
  };

  return (
    <Modal open={openModal === name} onClose={handleCloseModal}>
      <div className={styles.modalContent} style={stylesWrapper}>
        <div className={!secondaryAction.hide ? styles.headerWithDelete : ""}>
          {title && <h2>{title}</h2>}
          {!secondaryAction.hide && (
            <Icon
              className={styles.deleteIcon}
              onClick={handleSecondaryAction}
              title="DELETE"
            >
              delete_outline
            </Icon>
          )}
        </div>
        {children && (
          <div className={stylesWrapper ? "" : styles.children}>{children}</div>
        )}
        <div className={styles.buttonContainer}>
          {!hideSecondaryButton && (
            <Button
              onClick={handleCloseModal}
              variant="contained"
              size={stylesWrapper ? "small" : "large"}
            >
              Cancel
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            variant="contained"
            size={stylesWrapper ? "small" : "large"}
            disabled={isButtonDisabled}
          >
            {primaryButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
