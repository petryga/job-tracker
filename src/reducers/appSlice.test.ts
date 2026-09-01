import reducer, { updateState, isDragging, dragHappened } from "./appSlice";
import { appInitialState } from "./helpers";
import type { InitialState } from "./types";
import type { BoardApi } from "features/boardPage/types";

const makeBoard = (): BoardApi =>
  ({
    _id: "board-1",
    title: "My Board",
    isJobSearchBoard: false,
    lists: [
      {
        _id: "list-a",
        title: "To Do",
        cards: [
          { _id: "card-1", text: "one", subtext: "", color: "", isFavorite: false },
          { _id: "card-2", text: "two", subtext: "", color: "", isFavorite: false },
        ],
      },
      {
        _id: "list-b",
        title: "Done",
        cards: [
          { _id: "card-3", text: "three", subtext: "", color: "", isFavorite: false },
        ],
      },
    ],
  } as unknown as BoardApi);

const stateWithBoard = (): InitialState => ({
  isDragFinished: false,
  isDragging: false,
  boards: { "board-1": makeBoard() },
});

describe("appSlice", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(appInitialState);
  });

  describe("updateState", () => {
    it("stores the board under its id and resets isDragFinished", () => {
      const board = makeBoard();
      const state = reducer(
        { ...appInitialState, isDragFinished: true },
        updateState(board)
      );

      expect(state.isDragFinished).toBe(false);
      expect(state.boards["board-1"]).toEqual({
        _id: board._id,
        title: board.title,
        isJobSearchBoard: board.isJobSearchBoard,
        lists: board.lists,
      });
    });
  });

  describe("isDragging", () => {
    it("sets the dragging flag", () => {
      const state = reducer(appInitialState, isDragging(true));
      expect(state.isDragging).toBe(true);
    });
  });

  describe("dragHappened", () => {
    it("reorders lists when type is list", () => {
      const state = reducer(
        stateWithBoard(),
        dragHappened({
          type: "list",
          boardID: "board-1",
          source: { droppableId: "all-lists", index: 0 },
          destination: { droppableId: "all-lists", index: 1 },
        })
      );

      expect(state.boards["board-1"].lists.map((l) => l._id)).toEqual([
        "list-b",
        "list-a",
      ]);
      expect(state.isDragFinished).toBe(true);
    });

    it("reorders cards within the same list", () => {
      const state = reducer(
        stateWithBoard(),
        dragHappened({
          type: "card",
          boardID: "board-1",
          source: { droppableId: "list-a", index: 0 },
          destination: { droppableId: "list-a", index: 1 },
        })
      );

      const list = state.boards["board-1"].lists.find((l) => l._id === "list-a")!;
      expect(list.cards.map((c) => c._id)).toEqual(["card-2", "card-1"]);
      expect(state.isDragFinished).toBe(true);
    });

    it("is a no-op when source and destination index are identical", () => {
      const before = stateWithBoard();
      const state = reducer(
        before,
        dragHappened({
          type: "card",
          boardID: "board-1",
          source: { droppableId: "list-a", index: 0 },
          destination: { droppableId: "list-a", index: 0 },
        })
      );

      expect(state.boards["board-1"].lists[0].cards.map((c) => c._id)).toEqual([
        "card-1",
        "card-2",
      ]);
      // early-return branch never sets isDragFinished
      expect(state.isDragFinished).toBe(false);
    });

    it("moves a card across lists", () => {
      const state = reducer(
        stateWithBoard(),
        dragHappened({
          type: "card",
          boardID: "board-1",
          source: { droppableId: "list-a", index: 0 },
          destination: { droppableId: "list-b", index: 1 },
        })
      );

      const listA = state.boards["board-1"].lists.find((l) => l._id === "list-a")!;
      const listB = state.boards["board-1"].lists.find((l) => l._id === "list-b")!;

      expect(listA.cards.map((c) => c._id)).toEqual(["card-2"]);
      expect(listB.cards.map((c) => c._id)).toEqual(["card-3", "card-1"]);
      expect(state.isDragFinished).toBe(true);
    });
  });
});
