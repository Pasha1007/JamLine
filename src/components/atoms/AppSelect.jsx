import React from "react";
import Select from "react-select";

export const AppSelect = ({ className, ...props }) => {
  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#1D1D1E",
      boxShadow: state.isFocused ? "none" : "none",
      outline: "none",
      border: "none",
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#1D1D1E",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused ? "#3F3F3F" : "#1D1D1E",
      color: "#FFFFFF",
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: "#FF4C02",
    }),
  };

  return (
    <Select
      {...props}
      styles={customStyles}
      className={`${className}`}
      options={props.options}
      isSearchable={false}
    />
  );
};
