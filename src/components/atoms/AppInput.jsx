import React from "react";

export const AppInput = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`w-full p-2 px-3 outline-none bg-[#1D1D1E] hover:bg-[#2F2F2F] focus:bg-[#2F2F2F] rounded-xl transition-all duration-200 tektur-md ${className}`}
    />
  );
};
