import {
  useDeleteBoardMutation,
  useDeleteCardMutation,
  useDeleteListMutation,
} from "api/boardApi";
import { useDeleteContactMutation } from "api/contactsApi";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { closeModal, selectModal } from "reducers/modalSlice";
import { DELETE_BOARD, DELETE_CONTACT } from "utils/constants";

const useHandleSubmit = () => {
  const { boardID = "" } = useParams();
  const { modalProps } = useSelector(selectModal);
  const { id: cardID, listID, name, contactID } = modalProps || {};
  const [deleteCard] = useDeleteCardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [deleteList] = useDeleteListMutation();
  const [deleteContact] = useDeleteContactMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    if (name === DELETE_CONTACT && contactID) {
      return deleteContact({ contactID })
        .unwrap()
        .then((res) => {
          dispatch(closeModal());
          toast.success(res.message);
        })
        .catch((err) => {
          toast.error(err.data.message);
        });
    }

    if (boardID) {
      if (name === DELETE_BOARD) {
        return deleteBoard(boardID)
          .unwrap()
          .then((res) => {
            dispatch(closeModal());
            toast.success(res.message);
            navigate("/home");
          })
          .catch((err) => {
            toast.error(err.data.message);
          });
      }

      if (cardID && listID) {
        return deleteCard({ id: cardID, listID, boardID })
          .unwrap()
          .then((res) => {
            dispatch(closeModal());
            toast.success(res.message);
          })
          .catch((err) => {
            toast.error(err.data.message);
          });
      }

      if (listID) {
        return deleteList({ id: listID, boardID })
          .unwrap()
          .then((res) => {
            dispatch(closeModal());
            toast.success(res.message);
          })
          .catch((err) => {
            toast.error(err.data.message);
          });
      }
    }
  }, [
    boardID,
    cardID,
    contactID,
    deleteBoard,
    deleteCard,
    deleteContact,
    deleteList,
    dispatch,
    listID,
    name,
    navigate,
  ]);

  return handleSubmit;
};

export default useHandleSubmit;
