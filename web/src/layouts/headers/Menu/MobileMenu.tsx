/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router-dom";
import { useState } from "react";
import menu_data from "../../../data/MenuData";

const MobileMenu = () => {
  const [navTitle, setNavTitle] = useState("");

  const openMobileMenu = (menu: any) => {
    setNavTitle((prev: any) => (prev === menu ? "" : menu));
  };

  return (
    <ul>
      {menu_data.map((menu, i) => (
        <li key={i} className="menu-item-has-children">
          <Link to={menu.link}>{menu.title}</Link>
          {!!menu.has_dropdown && (
            <>
              <span
                className="dropdown-btn"
                onClick={() => openMobileMenu(menu.title)}
              ></span>
              <ul
                className={`sub-menu ${
                  navTitle === menu.title ? "active" : ""
                }`}
              >
                {menu?.sub_menus?.map((s, index) => (
                  <li key={index}>
                    <Link to={s.link}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}

      {/* --- Auth quick actions (mobil menü altı) --- */}
      <li className="mt-10">
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Sign up</Link>
      </li>
    </ul>
  );
};

export default MobileMenu;
