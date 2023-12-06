import type { Contact } from "features/jobModal/types";
import ContactCard from "./ContactCard";
import { DeleteModal } from "components/deleteModal/DeleteModal";
import { JobModal } from "features/jobModal/JobModal";

import styles from "./ContactsPage.module.css";

export const ContactsPage = ({ contacts }: { contacts: Contact[] }) => {
  return (
    <div className={styles.root}>
      {!!contacts.length &&
        contacts.map((contact: any) => (
          <div key={contact._id}>
            <ContactCard contact={contact} />
          </div>
        ))}
      <DeleteModal />
      <JobModal />
    </div>
  );
};
