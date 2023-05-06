import { useState } from "react";
import FormCard from "../card/Card";
import CreateNewEntry from "../form/CreateNewEntry";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Icon from "@material-ui/core/Icon";
import { ListComponentProps } from "./types";
import { useParams } from "react-router-dom";
import { EditInput } from "./EditInput";
import { CONFIRM_DELETE } from "utils/constants";
import { useDispatch } from "react-redux";
import { openModal, setModalProps } from "reducers/modalSlice";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import styles from "./List.module.css";

const FormList = ({ list, index, board, cards }: ListComponentProps) => {
  const { title, _id: listID } = list;
  const { boardID = "" } = useParams();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(title);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { isJobSearchBoard } = board;
  const jobsNumberTitle = cards.length === 1 ? "JOB" : "JOBS";

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDeleteModal = () => {
    dispatch(openModal(CONFIRM_DELETE));
    dispatch(setModalProps({ listID }));
    handleClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <Draggable draggableId={listID} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.listContainer}
          ref={provided.innerRef}
        >
          <Droppable droppableId={listID} type="card">
            {(provided) => (
              <>
                {isEditing ? (
                  <EditInput
                    setListTitle={setListTitle}
                    setIsEditing={setIsEditing}
                    listID={listID}
                    listTitle={listTitle}
                    boardID={boardID}
                    title={title}
                  />
                ) : (
                  <>
                    <div className={styles.titleContainer}>
                      <h4 className={styles.listTitle}>{listTitle}</h4>
                      <Icon className={styles.dotsIcon} onClick={handleClick}>
                        more_horiz
                      </Icon>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={() => {
                            setIsEditing(true);
                            handleClose();
                          }}
                        >
                          Edit Name
                        </MenuItem>
                        <MenuItem onClick={openDeleteModal}>
                          Delete List
                        </MenuItem>
                      </Menu>
                    </div>

                    {isJobSearchBoard && (
                      <span className={styles.number}>
                        {cards.length} {jobsNumberTitle}
                      </span>
                    )}
                  </>
                )}

                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {cards.map((card, index) => (
                    <FormCard
                      key={card._id}
                      card={card}
                      index={index}
                      listID={listID}
                      board={board}
                    />
                  ))}
                  {provided.placeholder}
                  {cards.length < 10 && (
                    <CreateNewEntry listID={listID} board={board} />
                  )}
                </div>
              </>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default FormList;
