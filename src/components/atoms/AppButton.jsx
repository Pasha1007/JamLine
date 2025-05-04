import React from "react";

export const AppButton = ({ className, children, onClick, type }) => {
  return (
    <button
      className={`bg-[#FF4C02] p-3 rounded-xl text-black flex justify-center items-center cursor-pointer ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
