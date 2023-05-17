import { InitialState, ModalState } from "./types";

export const appInitialState: InitialState = {
  isDragFinished: false,
  boards: {
    "board-0": {
      _id: "board-0",
      title: "",
      lists: [
        {
          title: "",
          cards: [
            {
              text: "",
              subtext: "",
              color: "",
              isFavorite: false,
              _id: "card-0",
            },
          ],
          _id: "list-0",
        },
      ],
      isJobSearchBoard: false,
    },
  },
};

export const modalInitialState: ModalState = {

  openModal: null,
  modalProps: { id: "", listID: "", name: "", contactID: ""  },
};
