import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { BoardApi } from "features/boardPage/types";
import styles from "./Nav.module.css";
import { CreateBoardModal } from "./CreateBoardModal";
import { CONFIRM_DELETE, CREATE_BOARD, DELETE_USER } from "utils/constants";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { DeleteModal } from "components/deleteModal/DeleteModal";

export const Nav = ({
  boards,
  handleLogout,
}: {
  boards: BoardApi[];
  handleLogout: () => void;
}) => {
  const isCreateAllowed = boards ? Object.keys(boards).length <= 9 : true;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const openCreateBoardModal = () => {
    dispatch(openModal(CREATE_BOARD));
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDeleteModal = () => {
    handleClose();
    dispatch(openModal(CONFIRM_DELETE));
    dispatch(setModalProps({ name: DELETE_USER }));
  };

  return (
    <>
      <div className={styles.header}>
        <h3>Job Application Tracker</h3>
        <div>
          <Icon className={styles.dotsIcon} onClick={handleClick}>
            more_horiz
          </Icon>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={openDeleteModal}>Delete User</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
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
      <DeleteModal />
    </>
  );
};
