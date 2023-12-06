import { FormEvent } from "react";

export interface ModalProps {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  isButtonDisabled?: boolean;
  name: string;
  onClose?: () => void;
  handleSubmit: (e: FormEvent) => void;
  secondaryAction?: {
    hide: boolean;
    onSecondaryAction?: () => void;
  };
  stylesWrapper?: React.CSSProperties;
  hideSecondaryButton?: boolean;
  primaryButtonText?: string;
}
