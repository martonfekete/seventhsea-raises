import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Rating } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import "./FiveSelectorContainer.css";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#000",
  },
  "& .MuiRating-iconHover": {
    color: "#000",
  },
});

function FiveSelector({ selected, valueSet, maxValue = 5 }) {
  const [value, setValue] = useState(selected);

  function setRank(i) {
    setValue(i);
    valueSet(i);
  }
  return (
    <StyledRating
      name="customized-color"
      defaultValue={value}
      icon={<RadioButtonCheckedIcon fontSize="inherit" />}
      emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
      value={value}
      max={maxValue}
      onChange={(event, newValue) => {
        setRank(newValue);
      }}
    />
  );
}

export default FiveSelector;
