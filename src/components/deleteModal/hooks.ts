import {
  useDeleteBoardMutation,
  useDeleteCardMutation,
  useDeleteListMutation,
} from "api/boardApi";
import { useDeleteContactMutation } from "api/contactsApi";
import { useDeleteUserMutation } from "api/userApi";
import { handleLogout } from "features/homePage/helpers";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { closeModal, selectModal } from "reducers/modalSlice";
import { DELETE_BOARD, DELETE_CONTACT, DELETE_USER } from "utils/constants";

const useHandleSubmit = () => {
  const userId = localStorage.getItem("userId") || "";
  const { boardID = "" } = useParams();
  const { modalProps } = useSelector(selectModal);
  const { id: cardID, listID, name, contactID } = modalProps || {};
  const [deleteCard] = useDeleteCardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [deleteList] = useDeleteListMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteContact] = useDeleteContactMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    if (name === DELETE_USER && userId) {
      return deleteUser({ userId })
        .unwrap()
        .then(() => {
          dispatch(closeModal());
          handleLogout();
          toast.success("User deleted successfully");
        })
        .catch((err) => {
          toast.error(err.data.message);
        });
    }

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
    deleteUser,
    dispatch,
    listID,
    name,
    navigate,
    userId,
  ]);

  return handleSubmit;
};

export default useHandleSubmit;
