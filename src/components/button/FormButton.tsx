import { MouseEventHandler, ReactNode } from "react";
import Button from "@mui/material/Button";

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
