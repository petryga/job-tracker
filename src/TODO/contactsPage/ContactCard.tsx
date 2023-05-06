import { Contact } from "features/jobModal/types";
import styles from "./ContactsPage.module.css";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import { JOB_SEARCH } from "utils/constants";

const ContactCard = ({ contact }: { contact: Contact }) => {
  const dispatch = useDispatch();
  const { contactName, contactEmail, companyName, _id } = contact;

  const openContactModal = () => {
    dispatch(openModal(JOB_SEARCH));
    dispatch(setModalProps({ contactID: _id }));
  };

  return (
    <div className={styles.card} onClick={openContactModal}>
      {contactName && <h3>{contactName}</h3>}
      <p>{companyName}</p>
      {contactEmail && <p>{contactEmail}</p>}
    </div>
  );
};
export default ContactCard;
