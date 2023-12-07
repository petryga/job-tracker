import { LikeIcon } from "components/card/IconsComponent";
import type { TitleProps } from "./types";
import styles from "./JobModal.module.css";

export const JobModalTitle = ({
  cardTitle,
  liked,
  setLiked,
  isFavorite,
}: TitleProps) => {
  return (
    <div className={styles.titleContainer}>
      <p>{cardTitle}</p>
      <LikeIcon
        liked={liked}
        setLiked={setLiked}
        style={{ color: liked ? "red" : "black", fontSize: 30 }}
        isFavorite={isFavorite}
      />
    </div>
  );
};
