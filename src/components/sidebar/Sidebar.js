import React, { useState } from "react";
import "./Sidebar.scss";
import { MdOutlineGasMeter } from "react-icons/md";
import { RiExpandLeftFill, RiExpandRightFill } from "react-icons/ri"; // Import new icons
import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { AdminMenu } from "../protect/HiddenLink";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="layout">
      <div className="sidebar" style={{ width: isOpen ? "270px" : "60px" }}>
        {" "}
        {/* always update line 60 padding left to be same value as side bar open */}
        <div className="top_section">
          <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
            <MdOutlineGasMeter
              size={35}
              style={{ cursor: "pointer" }}
              onClick={goHome}
            />
          </div>

          <div
            className="bars"
            style={{ marginLeft: isOpen ? "100px" : "0px" }}
            onClick={toggle} // Click to toggle sidebar
          >
            {isOpen ? (
              <RiExpandLeftFill size={35} /> // Left arrow when sidebar is open
            ) : (
              <RiExpandRightFill size={35} /> // Right arrow when sidebar is collapsed
            )}
          </div>
        </div>
        {/* Render all non-Help menu items */}
        {menu.map((item, index) => {
          // Check if the item is admin-specific and wrap it with AdminMenu
          if (item.isAdmin) {
            return (
              <AdminMenu key={index}>
                <SidebarItem item={item} isOpen={isOpen} />
              </AdminMenu>
            );
          }

          return <SidebarItem key={index} item={item} isOpen={isOpen} />;
        })}
      </div>
      <main
        style={{
          paddingLeft: isOpen ? "270px" : "60px",
          transition: "all .5s",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
