/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router-dom";
import { useState } from "react";
import menu_data from "../../../data/MenuData";

const MobileMenu = () => {
  const [navTitle, setNavTitle] = useState("");

  const openMobileMenu = (menu: any) => {
    setNavTitle((prev: any) => (prev === menu ? "" : menu));
  };

  // Icon mapping for menu items
  const getMenuIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'home':
        return 'fa-solid fa-house';
      case 'tours':
        return 'fa-solid fa-map-location-dot';
      case 'contact':
        return 'fa-solid fa-envelope';
      default:
        return 'fa-solid fa-circle';
    }
  };

  return (
    <ul style={{ 
      listStyle: 'none', 
      margin: 0, 
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {menu_data.map((menu, i) => (
        <li 
          key={i} 
          className="menu-item-has-children"
          style={{
            margin: 0,
            padding: 0
          }}
        >
          <Link 
            to={menu.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: '#333',
              fontSize: '17px',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              background: 'transparent',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9ff';
              e.currentTarget.style.color = '#560CE3';
              e.currentTarget.style.borderColor = '#e8eaff';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <i 
              className={getMenuIcon(menu.title)}
              style={{
                fontSize: '20px',
                width: '26px',
                textAlign: 'center',
                color: '#560CE3'
              }}
            />
            <span>{menu.title}</span>
          </Link>
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
    </ul>
  );
};

export default MobileMenu;
