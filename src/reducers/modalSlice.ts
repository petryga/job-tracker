import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store/store";
import { modalInitialState } from "./helpers";
import { ModalState } from "./types";

const modalSlice = createSlice({
  name: "modal",
  initialState: modalInitialState,
  reducers: {
    openModal: (state, { payload }) => {
      state.openModal = payload;
    },
    closeModal: (state) => {
      state.openModal = modalInitialState.openModal;
      state.modalProps = modalInitialState.modalProps;
    },
    setModalProps: (state, { payload }) => {
      state.modalProps = { ...state.modalProps, ...payload };
    },
  },
});

export const { openModal, closeModal, setModalProps } = modalSlice.actions;

export const selectModal = (state: RootState): ModalState => state.modal;

export default modalSlice.reducer;
