import type { Board } from "reducers/types";
import { PieChart } from "./PieChart";
import { ModalComponent } from "components/modal/Modal";
import { useDispatch } from "react-redux";
import { CHART_MODAL } from "utils/constants";
import { closeModal } from "reducers/modalSlice";

export const ChartModal = ({ boardState }: { boardState: Board }) => {
  const dispatch = useDispatch();

  return (
    <ModalComponent
      name={CHART_MODAL}
      title="chart"
      handleSubmit={() => dispatch(closeModal())}
      stylesWrapper={{
        marginTop: "80px",
        width: "1000px",
        textAlign: "center",
      }}
      hideSecondaryButton
      primaryButtonText="Close"
    >
      <PieChart boardState={boardState} />
    </ModalComponent>
  );
};
