import Icon from "@material-ui/core/Icon";
import styles from "./Nav.module.css";
import { CreateBoardModal } from "./CreateBoardModal";
import { CONFIRM_DELETE, DELETE_USER } from "utils/constants";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { DeleteModal } from "components/deleteModal/DeleteModal";
import { handleLogout } from "features/homePage/helpers";

export const Nav = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

        <Icon className={styles.dotsIcon} onClick={handleClick}>
          power_settings_new
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

      <CreateBoardModal />
      <DeleteModal />
    </>
  );
};
