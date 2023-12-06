import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import Icon from "@material-ui/core/Icon";
import { openModal, setModalProps } from "reducers/modalSlice";
import { CHART_MODAL, CONFIRM_DELETE, DELETE_BOARD } from "utils/constants";
import { useDispatch } from "react-redux";
import { EditableInput } from "components/editableInput/EditableInput";
import { useState } from "react";
import { BoardApi } from "features/boardPage/types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

export const Header = ({
  title,
  board,
}: {
  title: string;
  board: BoardApi;
}) => {
  const dispatch = useDispatch();
  const [editTitle, setEditTitle] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDeleteModal = () => {
    dispatch(openModal(CONFIRM_DELETE));
    dispatch(setModalProps({ name: DELETE_BOARD }));
    handleClose();
  };

  const openChartModal = () => {
    dispatch(openModal(CHART_MODAL));

    handleClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className={styles.header}>
      <Link className={styles.goBackLink} to="/home">
        <Icon>arrow_back</Icon>
      </Link>
      <div>
        {editTitle ? (
          <EditableInput board={board} setEditTitle={setEditTitle} />
        ) : (
          <div className={styles.titleGroup}>
            <h2>{title}</h2>
            <Icon className={styles.dotsIcon} onClick={handleClick}>
              more_horiz
            </Icon>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={openChartModal}>See Chart</MenuItem>
              <MenuItem
                onClick={() => {
                  setEditTitle(true);
                  handleClose();
                }}
              >
                Edit Name
              </MenuItem>
              <MenuItem onClick={openDeleteModal}>Delete Board</MenuItem>
            </Menu>
          </div>
        )}
      </div>
      <div />
    </div>
  );
};
