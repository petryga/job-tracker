import { BoardApi } from "features/boardPage/types";

export interface CreateProps {
  list?: boolean;
  listID?: string;
  board: BoardApi;
}

export interface FormProps {
  list?: boolean;
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  closeForm: () => void;
  children?: React.ReactNode;
  board: BoardApi;
  handleKeyPress?: (e: KeyboardEvent) => void;
}

export interface OpenFormProps {
  list?: boolean;
  children: string;
  onClick: () => void;
}
