import React from "react";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { IconLogout } from "../icons/IconLogout";
import { logoutUser } from "../../services/authService";
import { toast } from "react-toastify";

import IconLogo from "../../assets/logo-full.svg";
import IconRecord from "../icons/icon-record.svg";
import IconSeparate from "../icons/icon-separate.svg";
import IconStorage from "../icons/icon-storage.svg";

export default function Header() {
  const [activeLink, setActiveLink] = useState("record");
  const navigate = useNavigate();
  const handleLinkClick = (link) => {
    setActiveLink(link);
    navigate(link);
  };

  const links = useMemo(
    () => [
      { name: "record", label: "Record", icon: IconRecord, path: "/" },
      {
        name: "separate",
        label: "Separate",
        icon: IconSeparate,
        path: "/separate",
      },
      {
        name: "storage",
        label: "Storage",
        icon: IconStorage,
        path: "/storage",
      },
    ],
    []
  );

  const logout = () => {
    logoutUser();
    toast.success("Successfuly logged out!");
    navigate("/auth");
  };
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentLink = links.find((link) => link.path === currentPath);
    if (currentLink) {
      setActiveLink(currentLink.path);
    }
  }, [links]);

  return (
    <header>
      <motion.div
        className="header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center">
          <img src={IconLogo} alt="Logo" className="" />
        </div>
        <nav>
          <div className="flex gap-1">
            {links.map((link) => (
              <div
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`flex tektur-md cursor-pointer hover:bg-[#ffffff13] rounded-lg px-4 py-1 transition-all duration-200 grayscale text-[#ffffff86]! ${
                  activeLink === link.path
                    ? "grayscale-0 text-white! bg-[#ffffff13]"
                    : ""
                }`}
              >
                <img src={link.icon} alt={link.name} className="pr-2" />
                <span>{link.label}</span>
              </div>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-[144px] tektur-md text-right">Pavlo Kramar</div>
          <div className="text-[#FF4C02] cursor-pointer" onClick={logout}>
            <IconLogout />
          </div>
        </div>
      </motion.div>
    </header>
  );
}
