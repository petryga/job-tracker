import BoardThumbnail from "./BoardThumbnail";
import { Nav } from "components/nav/Nav";
import { useGetBoardsQuery } from "api/boardApi";
import styles from "./HomePage.module.css";
import Button from "@material-ui/core/Button";
import { handleLogout } from "./helpers";

const HomePage = () => {
  const userId = localStorage.getItem("userId") || "";
  const {
    data: boards,
    isFetching,
    isLoading,
  } = useGetBoardsQuery({ userId }, { skip: !userId });

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }

  if (boards) {
    return (
      <div className={styles.homeRoot}>
        <Nav boards={boards} handleLogout={handleLogout} />
        {!!boards.length ? (
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
  }

  return (
    <div>
      <div>Can't load boards</div>
      <br />
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  );
};

export default HomePage;
