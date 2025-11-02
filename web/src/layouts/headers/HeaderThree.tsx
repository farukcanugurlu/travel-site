import NavMenu from "./Menu/NavMenu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import UseSticky from "../../hooks/UseSticky";
import authApiService from "../../api/auth";
import settingsApi, { type SiteSettingsData } from "../../api/settings";

const HeaderThree = () => {
  const { sticky } = UseSticky();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  useEffect(() => { settingsApi.getSettings().then(setSettings).catch(() => setSettings(null)); }, []);
  
  const currentUser = authApiService.getCurrentUser();

  return (
    <>
      <style>{`
        /* HeaderThree: transparan başla, sticky olunca beyaz */
        #header-sticky {
          transition: background-color .25s ease, box-shadow .25s ease;
          background: transparent;
        }
        #header-sticky.header-sticky {
          background: #fff;
          box-shadow: 0 6px 22px rgba(0,0,0,.06);
        }

        /* Sağdaki ikon butonları */
        .tg-icon-btn{
          width:40px;height:40px;border-radius:50%;
          display:inline-flex;align-items:center;justify-content:center;
          border:1px solid rgba(0,0,0,.08);
          background:#fff;
          margin-left:10px;
          transition:all .2s ease;
        }
        .tg-icon-btn:hover{
          transform:translateY(-1px);
          box-shadow:0 6px 16px rgba(0,0,0,.08);
        }
        .tg-icon-btn i{ font-size:16px; }

        /* Logo geçişi */
        #header-sticky .logo .logo-2 { display: none; }
        #header-sticky.header-sticky .logo .logo-1 { display: none; }
        #header-sticky.header-sticky .logo .logo-2 { display: inline-block; }

        /* Auth Links */
        .auth-links {
          display: flex;
          gap: 8px;
        }
        .auth-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .auth-link:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .auth-link i {
          font-size: 12px;
        }
        .auth-text {
          display: none;
        }
        @media (min-width: 768px) {
          .auth-text {
            display: inline;
          }
        }
        /* Sticky durumda auth linkler */
        #header-sticky.header-sticky .auth-link {
          background: #f8f9fa;
          color: #2c3e50;
          border-color: #e0e0e0;
        }
        #header-sticky.header-sticky .auth-link:hover {
          background: #e9ecef;
        }
      `}</style>

      <header className="tg-header-height">
        <div
          className={`tg-header__area tg-header-lg-space z-index-999 tg-transparent ${
            sticky ? "header-sticky" : ""
          }`}
          id="header-sticky"
        >
          <div className="container-fluid container-1860">
            <div className="row align-items-center">
              {/* SOL: Logo + Menü */}
              <div className="col-lg-7 col-5">
                <div className="tgmenu__wrap d-flex align-items-center">
                  <div className="logo">
                    <Link className="logo-1" to="/">
                      <img src={settings?.logoUrl || "/assets/img/logo/logo-white.png"} alt="Lexor" />
                    </Link>
                    <Link className="logo-2" to="/">
                      <img src={settings?.logoUrl || "/assets/img/logo/logo-green.png"} alt="Lexor" />
                    </Link>
                  </div>

                  <nav className="tgmenu__nav tgmenu-1-space ml-180">
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex align-items-center">
                      <NavMenu />
                      <ul className="tgmenu__list ml-20">
                        <li>
                          <Link to="/blog">Blog</Link>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>

              {/* SAĞ: Auth Links + Cart + Sidebar/Offcanvas */}
              <div className="col-lg-5 col-7">
                <div className="d-flex align-items-center justify-content-end">
                  {/* Auth Links */}
                  <div className="d-none d-sm-flex align-items-center mr-10">
                    {currentUser ? (
                      <div className="auth-user">
                        <Link to="/profile" className="auth-link">
                          <i className="fa-regular fa-user" />
                          <span className="auth-text">{currentUser.firstName}</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="auth-links">
                        <Link to="/login" className="auth-link">
                          <i className="fa-regular fa-sign-in" />
                          <span className="auth-text">Login</span>
                        </Link>
                        <Link to="/register" className="auth-link">
                          <i className="fa-regular fa-user-plus" />
                          <span className="auth-text">Register</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="d-none d-sm-flex align-items-center">
                    <Link to="/cart" className="tg-icon-btn" aria-label="Cart">
                      <i className="fa-regular fa-cart-shopping" />
                    </Link>
                  </div>

                  <div className="tg-header-menu-bar lh-1 p-relative ml-10 pl-10">
                    {/* Desktop Sidebar */}
                    <button
                      onClick={() => setSidebar(true)}
                      className="tgmenu-offcanvas-open-btn menu-tigger d-none d-xl-block tg-icon-btn"
                      aria-label="Open sidebar"
                    >
                      <i className="fa-regular fa-bars" />
                    </button>
                    {/* Mobile Offcanvas */}
                    <button
                      onClick={() => setOffCanvas(true)}
                      className="tgmenu-offcanvas-open-btn mobile-nav-toggler d-block d-xl-none tg-icon-btn"
                      aria-label="Open mobile menu"
                    >
                      <i className="fa-regular fa-bars" />
                    </button>
                  </div>
                </div>
              </div>
              {/* /SAĞ */}
            </div>
          </div>
        </div>
      </header>

      <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
    </>
  );
};

export default HeaderThree;
