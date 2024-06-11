import React from "react";
import { useNavigate } from "react-router-dom";

import { BsPencil } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

const EditIconField = ({ redirect, tooltipContent }) => {
  const navigate = useNavigate();

  return (
    <ClickableIcon
      Icon={BsPencil}
      onClick={() => navigate(redirect)}
      tooltipProps={{ content: tooltipContent }}
    />
  );
};

export default EditIconField;
