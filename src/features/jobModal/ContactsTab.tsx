import { ChangeEvent } from "react";
import {
  CONTACTS_FIELDS,
  CONTACTS_FIELDS_INITIAL_VALUES,
  getWidth,
} from "./helpers";
import TextField from "@mui/material/TextField";
import type { Contact, ContactsTabProps } from "./types";
import { Button } from "@mui/material";

import styles from "./JobModal.module.css";

export const ContactsTab = ({ formData, setFormData }: ContactsTabProps) => {
  const handleChangeContacts =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const updatedContactsData = [...formData.contacts];

      updatedContactsData[index] = {
        ...updatedContactsData[index],
        [name]: value,
      };

      const updatedFormData = {
        ...formData,
        contacts: updatedContactsData,
      };

      setFormData(updatedFormData);
    };

  const handleAddContact = () => {
    const updatedContactsData = [
      ...formData.contacts,
      { ...CONTACTS_FIELDS_INITIAL_VALUES },
    ];

    const updatedFormData = {
      ...formData,
      contacts: updatedContactsData,
    };

    setFormData(updatedFormData);
  };

  const handleDeleteContact = (index: number) => {
    const updatedContactsData = [...formData.contacts];
    updatedContactsData.splice(index, 1);

    const updatedFormData = {
      ...formData,
      contacts: updatedContactsData,
    };

    setFormData(updatedFormData);
  };

  const width = getWidth({ length: formData.contacts.length });

  return (
    <>
      <div className={styles.contactsContainer}>
        {formData.contacts.map((contact, index) => (
          <div key={index}>
            {CONTACTS_FIELDS.map(
              ({ name, label, type = "text", required }, i) => {
                const isTextArea = type === "textarea";
                const isError = required && !contact[name as keyof Contact];

                return (
                  <TextField
                    slotProps={{ inputLabel: { shrink: true } }}
                    key={i}
                    style={{ width }}
                    className={styles.contactsInput}
                    name={name}
                    type={type}
                    label={label}
                    variant="outlined"
                    value={contact[name as keyof Contact]}
                    onChange={handleChangeContacts(index)}
                    multiline={isTextArea}
                    minRows={isTextArea ? 4 : 1}
                    required={required}
                    error={isError}
                  />
                );
              }
            )}
            <div className={styles.deleteContainer}>
              {index > 0 && (
                <Button onClick={() => handleDeleteContact(index)}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {formData.contacts.length < 3 && (
        <Button onClick={handleAddContact}>add another contact</Button>
      )}
    </>
  );
};
