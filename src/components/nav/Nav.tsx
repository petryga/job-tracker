import Icon from "@mui/material/Icon";
import styles from "./Nav.module.css";
import { CreateBoardModal } from "./CreateBoardModal";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { DeleteModal } from "components/deleteModal/DeleteModal";
import { handleLogout } from "features/homePage/helpers";

export const Nav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>

      <CreateBoardModal />
      <DeleteModal />
    </>
  );
};
