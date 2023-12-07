import type { Contact } from "features/jobModal/types";
import styles from "./ContactsPage.module.css";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import { CONFIRM_DELETE, DELETE_CONTACT } from "utils/constants";
import { Icon, Menu, MenuItem } from "@material-ui/core";
import { useState } from "react";

const ContactCard = ({ contact }: { contact: Contact }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const {
    contactName,
    contactEmail,
    contactPhone,
    contactNotes,
    companyName,
    _id,
    position,
  } = contact;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDeleteModal = () => {
    dispatch(openModal(CONFIRM_DELETE));
    dispatch(setModalProps({ contactID: _id, name: DELETE_CONTACT }));
    handleClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  if (!contactName) return null;

  return (
    <div className={styles.card}>
      <div className={styles.personalInfo}>
        <div className={styles.nameGroup}>
          <h3>{contactName}</h3>
          <Icon onClick={handleClick}>more_horiz</Icon>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={openDeleteModal}>Delete Contact</MenuItem>
          </Menu>
        </div>
        <p>{companyName}</p>
        <p>{position}</p>
      </div>

      <div className={styles.contactInfo}>
        <p>
          <Icon className={styles.icon}>mail_outline</Icon>
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          ) : (
            "none"
          )}
        </p>
        <p>
          <Icon className={styles.icon}>phone_enabled</Icon>
          {contactPhone || "none"}
        </p>
        <p>
          <Icon className={styles.icon}>notes</Icon>
          {contactNotes || "none"}
        </p>
      </div>
    </div>
  );
};
export default ContactCard;
