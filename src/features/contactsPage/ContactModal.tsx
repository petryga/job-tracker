import TextField from "@material-ui/core/TextField";
import {
  useGetContactQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from "api/contactsApi";
import { ModalComponent } from "components/modal/Modal";
import { Contact } from "features/jobModal/types";
import { CONTACTS_FIELDS } from "features/jobModal/helpers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, selectModal } from "reducers/modalSlice";
import { CONTACT_MODAL } from "utils/constants";

import styles from "./ContactsPage.module.css";
import toast from "react-hot-toast";

const style = { height: "550px", marginTop: "150px", width: "550px" };

export const ContactModal = () => {
  const dispatch = useDispatch();
  const { modalProps } = useSelector(selectModal);
  const [deleteContact] = useDeleteContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const { id, name: contactName } = modalProps || {};
  const {
    data: contact,
    isFetching,
    isLoading,
  } = useGetContactQuery({ id }, { skip: !id });
  const [formData, setFormData] = useState<Contact>();

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData(undefined);
    }
  }, [contact]);

  const handleUpdate = () => {
    if (id) {
      updateContact({ id, contact: formData })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          dispatch(closeModal());
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const handleDeleteContact = () => {
    if (id) {
      deleteContact({ id })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value } as unknown as Contact);
  };

  if (formData) {
    return (
      <ModalComponent
        name={CONTACT_MODAL}
        isButtonDisabled={isFetching || isLoading}
        title={contactName}
        handleSubmit={handleUpdate}
        stylesWrapper={style}
        secondaryAction={{
          hide: false,
          onSecondaryAction: handleDeleteContact,
        }}
      >
        <div className={styles.contactContainer}>
          {Object.keys(formData).map((field) => (
            <div key={field}>
              {CONTACTS_FIELDS.map(({ name, label, type = "text" }, i) => {
                if (name === field) {
                  const isTextArea = type === "textarea";

                  return (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      key={`${name}-${i}`}
                      className={styles.contactsInput}
                      name={name}
                      type={type}
                      label={label}
                      variant="outlined"
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      multiline={isTextArea}
                      minRows={isTextArea ? 4 : 1}
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </ModalComponent>
    );
  }
  return null;
};
