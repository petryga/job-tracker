import { ChangeEvent, useState } from "react";
import FormButton from "../button/FormButton";
import Form from "./Form";
import OpenForm from "./OpenForm";
import type { CreateProps } from "./types";
import { useParams } from "react-router-dom";
import { useAddCardMutation, useAddListMutation } from "api/boardApi";

export const CreateNewEntry = ({ list, listID, board }: CreateProps) => {
  const { isJobSearchBoard } = board;
  const userId = localStorage.getItem("userId") || "";
  const { boardID = "" } = useParams();
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState("");
  const [addList] = useAddListMutation();
  const [addCard] = useAddCardMutation();

  const openForm = () => {
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleAddList = () => {
    if (boardID && text) {
      addList({ title: text, boardID })
        .then(() => {
          setText("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddCard = () => {
    if (listID && text && boardID) {
      addCard({ listID, boardID, text, isJobSearchBoard, userId })
        .unwrap()
        .then(() => {
          setText("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (list) {
        handleAddList();
      } else {
        handleAddCard();
      }

      closeForm();
    }
  };

  return formOpen ? (
    <Form
      list={list}
      text={text}
      onChange={handleInputChange}
      closeForm={closeForm}
      board={board}
      handleKeyPress={handleKeyPress}
    >
      <FormButton onClick={list ? handleAddList : handleAddCard}>
        {list ? "Add List" : "Add Card"}
      </FormButton>
    </Form>
  ) : (
    <OpenForm list={list} onClick={openForm}>
      {!board.lists.length ? "Add list" : list ? "Add another list" : ""}
    </OpenForm>
  );
};

export default CreateNewEntry;
