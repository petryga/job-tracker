import { Contact } from "features/jobModal/types";
import styles from "./ContactsPage.module.css";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import { JOB_SEARCH } from "utils/constants";
import { Icon } from "@material-ui/core";

const ContactCard = ({ contact }: { contact: Contact }) => {
  const dispatch = useDispatch();
  const {
    contactName,
    contactEmail,
    contactPhone,
    contactNotes,
    companyName,
    _id,
    position,
  } = contact;

  const openContactModal = () => {
    dispatch(openModal(JOB_SEARCH));
    dispatch(setModalProps({ contactID: _id }));
  };

  if (!contactName) return null;

  return (
    <div className={styles.card} onClick={openContactModal}>
      <div className={styles.personalInfo}>
        <h3>{contactName}</h3>
        <p>{companyName}</p>
        <p>{position}</p>
      </div>

      <div className={styles.contactInfo}>
        <p>
          <Icon className={styles.icon}>email</Icon>
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          ) : (
            "none"
          )}
        </p>
        <p>
          <Icon className={styles.icon}>phone</Icon>
          {contactPhone || "none"}
        </p>
        <p>
          <Icon className={styles.icon}>note</Icon>
          {contactNotes || "none"}
        </p>
      </div>
    </div>
  );
};
export default ContactCard;
