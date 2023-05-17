import { Contact } from "features/jobModal/types";
import ContactCard from "./ContactCard";

import styles from "./ContactsPage.module.css";

const ContactsPage = ({ contacts }: { contacts: Contact[] }) => {
  return (
    // <>
      <div className={styles.root}>
        {!!contacts.length &&
          contacts.map((contact: any) => (
            <div key={contact._id}>
              <ContactCard contact={contact} />
            </div>
          ))}
      </div>
      // {/* <JobModal /> */}
    // </>
  );
};

export default ContactsPage;
