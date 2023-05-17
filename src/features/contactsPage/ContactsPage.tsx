import { Contact } from "features/jobModal/types";
import ContactCard from "./ContactCard";
import { DeleteModal } from "components/deleteModal/DeleteModal";

import styles from "./ContactsPage.module.css";

const ContactsPage = ({ contacts }: { contacts: Contact[] }) => {
  return (
    <div className={styles.root}>
      {!!contacts.length &&
        contacts.map((contact: any) => (
          <div key={contact._id}>
            <ContactCard contact={contact} />
          </div>
        ))}
      <DeleteModal />
    </div>
  );
};

export default ContactsPage;
