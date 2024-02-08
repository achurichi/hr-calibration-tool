import React from "react";

import "./ClickableIcon.scss";

const ClickableIcon = ({ children, onClick = () => {} }) => {
  return (
    <div className="clickable" onClick={onClick}>
      {children}
    </div>
  );
};

export default ClickableIcon;
