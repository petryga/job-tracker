import { ChangeEvent, useState, memo } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Draggable } from "react-beautiful-dnd";
import Form from "../form/Form";
import FormButton from "../button/FormButton";
import type { CardProps, EditFormProps, RenderCardProps } from "./types";
import { IconsComponent } from "./IconsComponent";
import styles from "./Card.module.css";
import { useUpdateCardMutation } from "api/boardApi";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import { JOB_SEARCH } from "utils/constants";
import classNames from "classnames";

const RenderCard = ({
  card,
  index,
  setIsEditing,
  listID,
  board,
}: RenderCardProps) => {
  const { _id: id, text: title, color, subtext: position, isFavorite } = card;
  const dispatch = useDispatch();
  const { isJobSearchBoard } = board;
  const [liked, setLiked] = useState(false);

  const openTheModal = (name: string) => {
    dispatch(setModalProps({ id, listID }));
    dispatch(openModal(name));
  };
  const isLongTitle = title?.length > 15;
  const isLongSubtext = position?.length > 20;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.cardContainer}
          ref={provided.innerRef}
        >
          <Card style={{ backgroundColor: color }}>
            <CardContent
              className={styles.cardContent}
              onDoubleClick={() => {
                if (isJobSearchBoard) {
                  dispatch(setModalProps({ name: JOB_SEARCH }));
                  openTheModal(JOB_SEARCH);
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <div className={styles.group}>
                <div
                  className={classNames(styles.text, {
                    [styles.longText]: isLongTitle,
                  })}
                >
                  {title}
                </div>
                <IconsComponent
                  isJobSearchBoard={isJobSearchBoard}
                  setLiked={setLiked}
                  liked={liked}
                  openDeleteModal={openTheModal}
                  isFavorite={isFavorite}
                />
              </div>
              {isJobSearchBoard && position && (
                <div
                  className={classNames(styles.subtext, {
                    [styles.longSubtext]: isLongSubtext,
                  })}
                >
                  {position}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const EditForm = ({
  setIsEditing,
  setText,
  id,
  cardText,
  text,
  board,
  listID,
}: EditFormProps) => {
  const [updateCard] = useUpdateCardMutation();

  const closeForm = () => {
    setIsEditing(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | KeyboardEvent) => {
    setText((e.target as HTMLInputElement).value);
  };

  const saveCard = () => {
    if (id && listID && board._id && cardText && cardText !== text) {
      updateCard({
        id,
        listID,
        boardID: board._id,
        text: cardText,
      }).then(() => {
        setIsEditing(false);
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCard();
    }
  };

  return (
    <Form
      board={board}
      text={cardText}
      onChange={handleChange}
      closeForm={closeForm}
      handleKeyPress={handleKeyPress}
    >
      <FormButton onClick={saveCard}>Save</FormButton>
    </Form>
  );
};

const FormCard = memo(({ card, listID, index, board }: CardProps) => {
  const { _id: id, text } = card;
  const [isEditing, setIsEditing] = useState(false);
  const [cardText, setText] = useState(text);

  return isEditing ? (
    <EditForm
      setIsEditing={setIsEditing}
      setText={setText}
      id={id}
      cardText={cardText}
      text={text}
      board={board}
      listID={listID}
    />
  ) : (
    <RenderCard
      card={card}
      index={index}
      setIsEditing={setIsEditing}
      listID={listID}
      board={board}
    />
  );
});

export default FormCard;
