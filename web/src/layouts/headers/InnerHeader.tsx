import NavMenu from "./Menu/NavMenu";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import UseSticky from "../../hooks/UseSticky";

const InnerHeader = () => {
  const { sticky } = UseSticky();
  const { pathname } = useLocation();
  // Eskiden login/register için koyu zemin vardı; artık bu rotalar yoksa yine çalışır.
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);

  return (
    <>
      <style>{`
        .tg-icon-btn{
          width:40px;height:40px;border-radius:50%;
          display:inline-flex;align-items:center;justify-content:center;
          border:1px solid rgba(0,0,0,.08); background:#fff;
          margin-left:10px; transition:all .2s ease;
        }
        .tg-icon-btn:hover{ transform:translateY(-1px); box-shadow:0 6px 16px rgba(0,0,0,.08); }
        .tg-icon-btn i{ font-size:16px; }

        .inner-auth-overlay{
          background: rgba(102,5,255,1);
        }
      `}</style>

      <header className="tg-header-height">
        <div
          id="header-sticky"
          className={[
            "tg-header__area tg-header-lg-space z-index-999 tg-transparent",
            sticky ? "header-sticky" : "",
            isAuthPage ? "inner-auth-overlay" : "",
          ].join(" ")}
        >
          <div className="container-fluid container-1860">
            <div className="row align-items-center">
              {/* SOL: Logo + Menü */}
              <div className="col-lg-7 col-5">
                <div className="tgmenu__wrap d-flex align-items-center">
                  <div className="logo">
                    <Link className="logo-1" to="/">
                      <img src="/assets/img/logo/logo-white.png" alt="Lexor" />
                    </Link>
                    <Link className="logo-2 d-none" to="/">
                      <img src="/assets/img/logo/logo-green.png" alt="Lexor" />
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

              {/* SAĞ: (Wishlist ve Auth KALDIRILDI) → sadece Cart + Sidebar/Offcanvas */}
              <div className="col-lg-5 col-7">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="d-none d-sm-flex align-items-center">
                    <Link to="/cart" className="tg-icon-btn" aria-label="Cart">
                      <i className="fa-regular fa-cart-shopping" />
                    </Link>
                  </div>

                  <div className="tg-header-menu-bar lh-1 p-relative ml-10 pl-10">
                    {/* Desktop sidebar aç */}
                    <button
                      onClick={() => setSidebar(true)}
                      className="tgmenu-offcanvas-open-btn menu-tigger d-none d-xl-block tg-icon-btn"
                      aria-label="Open sidebar"
                    >
                      <i className="fa-regular fa-bars" />
                    </button>
                    {/* Mobile offcanvas aç */}
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

export default InnerHeader;
