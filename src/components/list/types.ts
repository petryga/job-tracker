import { BoardApi, Card, List } from "features/boardPage/types";

export interface ListComponentProps {
  list: List;
  index: number;
  board: BoardApi;
  cards: Card[];
}

export interface EditInputProps {
  setListTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  listID: string;
  listTitle: string;
  boardID: string;
  title: string;
}
