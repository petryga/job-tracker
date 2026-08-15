import reducer, { openModal, closeModal, setModalProps } from "./modalSlice";
import { modalInitialState } from "./helpers";

describe("modalSlice", () => {
  it("returns the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(modalInitialState);
  });

  it("opens a modal by name", () => {
    const state = reducer(modalInitialState, openModal("jobSearch"));
    expect(state.openModal).toBe("jobSearch");
  });

  it("closes the modal and resets its props", () => {
    const opened = {
      openModal: "jobSearch",
      modalProps: { id: "card-1", listID: "list-1", name: "", contactID: "" },
    };

    const state = reducer(opened, closeModal());

    expect(state.openModal).toBe(modalInitialState.openModal);
    expect(state.modalProps).toEqual(modalInitialState.modalProps);
  });

  it("merges new modal props onto existing ones", () => {
    const state = reducer(
      modalInitialState,
      setModalProps({ id: "card-1" })
    );

    expect(state.modalProps).toEqual({
      ...modalInitialState.modalProps,
      id: "card-1",
    });

    const state2 = reducer(state, setModalProps({ listID: "list-1" }));
    expect(state2.modalProps).toEqual({
      ...modalInitialState.modalProps,
      id: "card-1",
      listID: "list-1",
    });
  });
});
