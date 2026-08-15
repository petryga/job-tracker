import type { ReactNode } from "react";

interface FakeProvided {
  innerRef: () => void;
  droppableProps: Record<string, never>;
  draggableProps: Record<string, never>;
  dragHandleProps: Record<string, never>;
  placeholder: null;
}

const provided: FakeProvided = {
  innerRef: () => {},
  droppableProps: {},
  draggableProps: {},
  dragHandleProps: {},
  placeholder: null,
};

export const DragDropContext = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

export const Droppable = ({
  children,
}: {
  children: (provided: FakeProvided) => ReactNode;
}) => <>{children(provided)}</>;

export const Draggable = ({
  children,
}: {
  children: (provided: FakeProvided) => ReactNode;
}) => <>{children(provided)}</>;
