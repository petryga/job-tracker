import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const BoardThumbnail = ({ title, id }: { title: string; id: string }) => {
  return (
    <Link className={styles.link} to={`/${id}`}>
      <div className={styles.thumbnail}>
        <h4 className={styles.title}>{title}</h4>
      </div>
    </Link>
  );
};

export default BoardThumbnail;
