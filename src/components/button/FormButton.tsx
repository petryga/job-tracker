import { MouseEventHandler, ReactNode } from "react";
import Button from "@material-ui/core/Button";

const FormButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLElement>;
}) => {
  return <Button onMouseDown={onClick}>{children}</Button>;
};

export default FormButton;
