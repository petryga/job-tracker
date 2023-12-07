import type { BoardApi, Card } from "features/boardPage/types";

export interface CardProps {
  card: Card;
  listID: string;
  index: number;
  board: BoardApi;
}

export interface RenderCardProps extends CardProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditFormProps {
  cardText: string;
  text: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  board: BoardApi;
  listID: string;
}

export interface LikedIconComponentProps {
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  liked: boolean;
  style?: React.CSSProperties;
  insideModal?: boolean;
  isFavorite: boolean;
}

export interface IconsComponentProps extends LikedIconComponentProps {
  isJobSearchBoard: boolean;
  openDeleteModal: (name: string) => void;
}
