import React, { useRef } from "react";

import Select from "react-select";

import AddMenu from "components/EditableSelect/AddMenu";
import DeletableOption from "components/EditableSelect/DeletableOption";

const EditableSelect = ({
  onAdd,
  onDelete,
  options,
  value,
  ...selectProps
}) => {
  const selectRef = useRef();

  return (
    <Select
      components={{
        Menu: (props) => <AddMenu {...props} selectRef={selectRef} />,
        Option: DeletableOption,
      }}
      onAdd={onAdd}
      onDelete={onDelete}
      options={options}
      ref={selectRef}
      value={value}
      {...selectProps}
    />
  );
};

export default EditableSelect;
