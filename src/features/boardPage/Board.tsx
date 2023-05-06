import { useEffect } from "react";
import FormList from "components/list/List";
import CreateNewEntry from "components/form/CreateNewEntry";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Link, useParams } from "react-router-dom";
import { JobModal } from "../jobModal/JobModal";
import Button from "@material-ui/core/Button";
import { useGetBoardByIdQuery, useUpdateBoardMutation } from "api/boardApi";
import { DeleteModal } from "components/deleteModal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { dragHappened, selectApp, updateState } from "reducers/appSlice";
import { Header } from "components/header/Header";
import styles from "./Board.module.css";

export const Board = (): JSX.Element => {
  const { boardID = "" } = useParams();
  const { boards, isDragFinished } = useSelector(selectApp);
  const boardState = boards[boardID as keyof typeof boards];
  const dispatch = useDispatch();
  const [updateBoard] = useUpdateBoardMutation();
  const {
    data: board,
    isFetching,
    isLoading,
  } = useGetBoardByIdQuery({ id: boardID });

  useEffect(() => {
    if (board) {
      dispatch(updateState(board));
    }
  }, [board, dispatch]);

  useEffect(() => {
    if (isDragFinished) {
      updateBoard({ id: boardID, data: boardState });
    }
  }, [boardID, boardState, isDragFinished, updateBoard]);

  const onDragEnd = ({ destination, source, type }: DropResult) => {
    if (source && type && boardID && destination) {
      dispatch(
        dragHappened({
          source,
          destination,
          type,
          boardID,
        })
      );
    }
  };

  if (boardState && board) {
    const { lists, title } = boardState;
    const isCreateLimit = lists && lists.length >= 6;

    return (
      <>
        <Header title={title} board={board} />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={lists.length ?  styles.listsContainer: styles.listsContainerEmpty}
              >
                {lists.map((list, index) => (
                  <FormList
                    list={list}
                    key={list._id}
                    index={index}
                    board={board}
                    cards={list.cards}
                  />
                ))}
                {provided.placeholder}

                {!isCreateLimit && <CreateNewEntry list={true} board={board} />}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <JobModal />
        <DeleteModal />
      </>
    );
  }

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.empty}>
      <p>Board not found 🥲</p>
      <Button>
        <Link className={styles.goBackLink} to="/home">
          Go Back
        </Link>
      </Button>
    </div>
  );
};

export default Board;
