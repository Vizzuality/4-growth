import * as React from "react";

interface DummyComponentProps {
  message?: string;
}

const DummyComponent: React.FC<DummyComponentProps> = ({
  message = "No message provided",
}) => {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default DummyComponent;
