import { DraggableLocation, TypeId } from "react-beautiful-dnd";

export interface DragPayload {
  source: DraggableLocation;
  destination: DraggableLocation;
  type: TypeId;
  boardID: string;
}

export interface InitialState {
  isDragFinished: boolean;
  isDragging: boolean;
  boards: {
    [key: string]: {
      _id: string;
      title: string;
      lists: {
        _id: string;
        title: string;
        cards: {
          _id: string;
          text: string;
          isFavorite: boolean;
          subtext: string;
          color: string;
        }[];
      }[];
      isJobSearchBoard: boolean;
    };
  };
}

export interface ModalState {
  openModal: string | null;
  modalProps: { [key: string]: string };
}
