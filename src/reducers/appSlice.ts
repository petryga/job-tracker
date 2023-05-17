import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/store";
import { DragPayload } from "./types";
import { BoardApi } from "features/boardPage/types";
import { appInitialState } from "./helpers";

const appSlice = createSlice({
  name: "app",
  initialState: appInitialState,
  reducers: {
    updateState: (state, { payload }: PayloadAction<BoardApi>) => {
      state.isDragFinished = false;
      const { _id, title, lists, isJobSearchBoard } = payload;

      state.boards[_id] = {
        title,
        _id,
        isJobSearchBoard,
        lists,
      };
    },

    isDragging: (state, { payload }: PayloadAction<boolean>) => {
      state.isDragging = payload;
    },

    dragHappened: (state, { payload }: PayloadAction<DragPayload>) => {
      const { source, destination, type, boardID } = payload;

      const droppableIdStart = source.droppableId;
      const droppableIdEnd = destination.droppableId;
      const droppableIndexEnd = destination.index;
      const droppableIndexStart = source.index;

      // dragging lists around
      if (type === "list") {
        const board = state.boards[boardID];
        const lists = board.lists;

        const pulledOutList = lists.splice(droppableIndexStart, 1);

        lists.splice(droppableIndexEnd, 0, ...pulledOutList);
        state.boards = { ...state.boards, [boardID]: board };
      }

      // in the same list
      if (type === "card" && droppableIdStart === droppableIdEnd) {
        if (droppableIndexEnd === droppableIndexStart) {
          return;
        }

        const list = state.boards[boardID].lists.find(
          (list) => list._id === droppableIdStart
        );

        const card = list?.cards.splice(droppableIndexStart, 1);

        list?.cards.splice(droppableIndexEnd, 0, ...card!);
        state.boards = {
          ...state.boards,
          [boardID]: {
            ...state.boards[boardID],
            lists: state.boards[boardID].lists.map((list) => {
              if (list._id === droppableIdStart) {
                return list;
              }
              return list;
            }),
          },
        };
      }

      if (type === "card" && droppableIdStart !== droppableIdEnd) {
        // card different list
        // find the list where the drag happened
        const listStart = state.boards[boardID].lists.find(
          (list) => list._id === droppableIdStart
        );
        const card = listStart?.cards.splice(droppableIndexStart, 1);

        // find the list where the drag ended
        const listEnd = state.boards[boardID].lists.find(
          (list) => list._id === droppableIdEnd
        );
        // put the card in the new list
        listEnd?.cards.splice(droppableIndexEnd, 0, ...card!);

        state.boards = {
          ...state.boards,
          [boardID]: {
            ...state.boards[boardID],
            lists: state.boards[boardID].lists.map((list) => {
              if (list._id === droppableIdStart) {
                return listStart!;
              }
              if (list._id === droppableIdEnd) {
                return listEnd!;
              }
              return list;
            }),
          },
        };
      }
      state.isDragFinished = true;
    },
  },
});

export const { updateState, isDragging, dragHappened } = appSlice.actions;

export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;
