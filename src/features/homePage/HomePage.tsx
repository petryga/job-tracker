import { Nav } from "components/nav/Nav";
import { useGetBoardsQuery } from "api/boardApi";
import styles from "./HomePage.module.css";
import Button from "@material-ui/core/Button";
import { openModal } from "reducers/modalSlice";
import { CREATE_BOARD } from "utils/constants";
import { useDispatch } from "react-redux";
import BoardThumbnail from "./BoardThumbnail";

const HomePage = () => {
  const userId = localStorage.getItem("userId") || "";
  const dispatch = useDispatch();

  const {
    data: boards,
    isFetching,
    isLoading,
  } = useGetBoardsQuery({ userId }, { skip: !userId });

  const isCreateAllowed = boards ? Object.keys(boards).length <= 9 : true;

  const openCreateBoardModal = () => {
    dispatch(openModal(CREATE_BOARD));
  };

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homeRoot}>
      <Nav />

      <div className={styles.actions}>
        <h3>Boards</h3>
        {isCreateAllowed ? (
          <Button onClick={openCreateBoardModal}>create board</Button>
        ) : (
          <h3 className={styles.limitError}>Limit reached</h3>
        )}
      </div>

      {!!boards?.length ? (
        boards.map((board) => (
          <div className={styles.thumbnails} key={board._id}>
            <BoardThumbnail title={board.title} id={board._id} />
          </div>
        ))
      ) : (
        <div>no boards</div>
      )}
    </div>
  );
};

export default HomePage;
