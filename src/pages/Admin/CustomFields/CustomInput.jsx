import React, { useRef } from "react";

const CustomInput = ({ Component, ...props }) => {
  const inputRef = useRef();

  // Remove the "is-valid" class and the "text-success" classes because they are causing issues with uniforms
  if (inputRef.current) {
    inputRef.current.classList.remove("is-valid");
    Array.from(inputRef.current.labels).forEach((label) => {
      label.classList.remove("text-success");
    });
  }

  return <Component inputRef={inputRef} {...props} />;
};

export default CustomInput;
