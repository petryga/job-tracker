import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { BoardApi } from "features/boardPage/types";
import styles from "./Nav.module.css";
import { CreateBoardModal } from "./CreateBoardModal";
import { CREATE_BOARD } from "utils/constants";
import { useDispatch } from "react-redux";
import { openModal } from "reducers/modalSlice";

export const Nav = ({
  boards,
  handleLogout,
}: {
  boards: BoardApi[];
  handleLogout: () => void;
}) => {
  const isCreateAllowed = boards ? Object.keys(boards).length <= 9 : true;
  const dispatch = useDispatch();

  const openCreateBoardModal = () => {
    dispatch(openModal(CREATE_BOARD));
  };

  return (
    <>
      <div className={styles.header}>
        <h3>Job Application Tracker</h3>
        <Icon onClick={handleLogout}>power_settings_new</Icon>
      </div>

      <div className={styles.actions}>
        <h3 className={styles.title}>Boards</h3>
        {isCreateAllowed ? (
          <Button onClick={openCreateBoardModal}>create board</Button>
        ) : (
          <h3 className={styles.limitError}>Limit reached</h3>
        )}
      </div>
      <CreateBoardModal />
    </>
  );
};
