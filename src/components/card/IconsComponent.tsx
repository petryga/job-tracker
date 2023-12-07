import Icon from "@material-ui/core/Icon";
import styles from "./Card.module.css";
import type { IconsComponentProps, LikedIconComponentProps } from "./types";
import { CONFIRM_DELETE } from "utils/constants";

export const LikeIcon = ({
  liked,
  setLiked,
  style = { color: "white", position: "absolute", right: "5px", top: " 5px" },
  insideModal = true,
  isFavorite,
}: LikedIconComponentProps) => {
  const handleOnLikedClick = () => {
    if (insideModal) {
      setLiked(!liked);
    }
  };

  const condition = insideModal ? liked : isFavorite;
  return (
    <Icon
      className={styles.likeButton}
      onClick={handleOnLikedClick}
      style={style}
    >
      {condition ? "favorite" : "favorite_border"}
    </Icon>
  );
};

export const IconsComponent = ({
  isJobSearchBoard,
  setLiked,
  liked,
  openDeleteModal,
  isFavorite,
}: IconsComponentProps) => {
  if (isJobSearchBoard) {
    return (
      <LikeIcon
        liked={liked}
        setLiked={setLiked}
        insideModal={false}
        isFavorite={isFavorite}
      />
    );
  }

  return (
    <Icon
      className={styles.deleteButton}
      fontSize="small"
      onClick={() => openDeleteModal(CONFIRM_DELETE)}
    >
      delete_outline
    </Icon>
  );
};
