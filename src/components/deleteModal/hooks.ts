import {
  useDeleteBoardMutation,
  useDeleteCardMutation,
  useDeleteListMutation,
} from "api/boardApi";
import { Dispatch, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { closeModal, selectModal } from "reducers/modalSlice";
import { DELETE_BOARD } from "utils/constants";

const useHandleSubmit = ({
  setButtonDisabled,
}: {
  setButtonDisabled: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { boardID = "" } = useParams();
  const { modalProps } = useSelector(selectModal);
  const { id: cardID, listID, name } = modalProps || {};
  const [deleteCard] = useDeleteCardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [deleteList] = useDeleteListMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    setButtonDisabled(true);
    if (boardID) {
      if (name === DELETE_BOARD) {
        return deleteBoard(boardID)
          .unwrap()
          .then((res) => {
            setButtonDisabled(false);
            dispatch(closeModal());
            toast.success(res.message);
            navigate("/home");
          })
          .catch((err) => {
            setButtonDisabled(false);
            toast.error(err.data.message);
          });
      }

      if (cardID && listID) {
        return deleteCard({ id: cardID, listID, boardID })
          .unwrap()
          .then((res) => {
            setButtonDisabled(false);
            dispatch(closeModal());
            toast.success(res.message);
          })
          .catch((err) => {
            setButtonDisabled(false);
            toast.error(err.data.message);
          });
      }

      if (listID) {
        return deleteList({ id: listID, boardID })
          .unwrap()
          .then((res) => {
            setButtonDisabled(false);
            dispatch(closeModal());
            toast.success(res.message);
          })
          .catch((err) => {
            setButtonDisabled(false);
            toast.error(err.data.message);
          });
      }
    }
  }, [
    boardID,
    cardID,
    deleteBoard,
    deleteCard,
    deleteList,
    dispatch,
    listID,
    name,
    navigate,
    setButtonDisabled,
  ]);

  return handleSubmit;
};

export default useHandleSubmit;
