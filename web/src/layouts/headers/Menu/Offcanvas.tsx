import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { useState } from "react";

interface MobileSidebarProps {
  offCanvas: boolean;
  setOffCanvas: (offCanvas: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: MobileSidebarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchValue("");
    setOffCanvas(false);
  };

  return (
    <div className={offCanvas ? "mobile-menu-visible" : ""}>
      <div className="tgmobile__menu">
        <nav className="tgmobile__menu-box">
          <div onClick={() => setOffCanvas(false)} className="close-btn">
            <i className="fa-solid fa-xmark"></i>
          </div>

          {/* LOGO */}
          <div className="nav-logo">
            <Link to="/" onClick={() => setOffCanvas(false)}>
              <img src="/assets/img/logo/logo-green.png" alt="logo" />
            </Link>
          </div>

          {/* SEARCH */}
          <div className="tgmobile__search">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search here..."
                value={searchValue}
                onChange={handleSearchChange}
              />
            </form>
          </div>

          {/* === AUTH: Login / Sign up (mobil offcanvas) === */}
          <div className="mb-20">
            <Link
              to="/login"
              onClick={() => setOffCanvas(false)}
              className="tg-btn tg-btn-sm d-block mb-10"
              style={{ width: "100%", textAlign: "center" }}
            >
              <i
                className="fa-regular fa-right-to-bracket"
                style={{ marginRight: 8 }}
              />
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOffCanvas(false)}
              className="tg-btn tg-btn-outline tg-btn-sm d-block"
              style={{ width: "100%", textAlign: "center" }}
            >
              <i
                className="fa-regular fa-user-plus"
                style={{ marginRight: 8 }}
              />
              Sign up
            </Link>
          </div>
          {/* ================================================= */}

          {/* MOBILE MENU */}
          <div className="tgmobile__menu-outer">
            <MobileMenu />
          </div>

          {/* SOCIALS */}
          <div className="social-links">
            <ul className="list-wrap">
              <li>
                <Link to="#" onClick={() => setOffCanvas(false)}>
                  <i className="fab fa-facebook-f"></i>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setOffCanvas(false)}>
                  <i className="fab fa-twitter"></i>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setOffCanvas(false)}>
                  <i className="fab fa-instagram"></i>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setOffCanvas(false)}>
                  <i className="fab fa-linkedin-in"></i>
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setOffCanvas(false)}>
                  <i className="fab fa-youtube"></i>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* overlay */}
      <div
        onClick={() => setOffCanvas(false)}
        className="tgmobile__menu-backdrop"
      />
    </div>
  );
};

export default Offcanvas;
