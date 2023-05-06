import { useGetContactsQuery } from "TODO/contactsApi";
import ContactCard from "./ContactCard";
// import { ContactModal } from "./ContactModal";

import styles from "./ContactsPage.module.css";

const ContactsPage = () => {
  const { data: contacts, isFetching, isLoading } = useGetContactsQuery({});

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.root}>
        {contacts &&
          contacts.map((contact) => (
            <div key={contact._id}>
              <ContactCard contact={contact} />
            </div>
          ))}
      </div>
      {/* <JobModal /> */}
    </>
  );
};

export default ContactsPage;
