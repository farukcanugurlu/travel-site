import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import { useState, useEffect } from "react";
import authApiService from "../../../api/auth";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";
import { normalizeImageUrl } from "../../../utils/imageUtils";

interface MobileSidebarProps {
  offCanvas: boolean;
  setOffCanvas: (offCanvas: boolean) => void;
}

const Offcanvas = ({ offCanvas, setOffCanvas }: MobileSidebarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    setIsAuthenticated(authApiService.isAuthenticated());
  }, [offCanvas]); // Update when sidebar opens/closes

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  // Sidebar logo: önce sidebarLogo, yoksa logo, yoksa default
  const sidebarLogo = settings?.sidebarLogo 
    ? normalizeImageUrl(settings.sidebarLogo) 
    : (settings?.logo 
      ? normalizeImageUrl(settings.logo) 
      : "/assets/img/logo/logo-green.png");

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
              <img src={sidebarLogo} alt="logo" />
            </Link>
          </div>

          {/* MOBILE MENU */}
          <div className="tgmobile__menu-outer" style={{ marginBottom: '24px' }}>
            <MobileMenu />
            
            {/* Blog Link */}
            <Link
              to="/blog"
              onClick={() => setOffCanvas(false)}
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
                border: '1px solid transparent',
                marginTop: '8px'
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
                className="fa-regular fa-blog"
                style={{
                  fontSize: '20px',
                  width: '26px',
                  textAlign: 'center',
                  color: '#560CE3'
                }}
              />
              <span>Blog</span>
            </Link>
          </div>

          {/* === USER ACTIONS: Profile & Cart (if authenticated) === */}
          {isAuthenticated && (
            <div style={{ 
              marginBottom: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e8eaff',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <Link
                to="/profile"
                onClick={() => setOffCanvas(false)}
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
                  className="fa-regular fa-user"
                  style={{
                    fontSize: '20px',
                    width: '26px',
                    textAlign: 'center',
                    color: '#560CE3'
                  }}
                />
                <span>My Profile</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setOffCanvas(false)}
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
                  className="fa-regular fa-cart-shopping"
                  style={{
                    fontSize: '20px',
                    width: '26px',
                    textAlign: 'center',
                    color: '#560CE3'
                  }}
                />
                <span>Cart</span>
              </Link>
            </div>
          )}

          {/* === AUTH: Login / Sign up (mobil offcanvas) - Only show if NOT authenticated === */}
          {!isAuthenticated && (
            <div style={{ 
              marginBottom: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e8eaff',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link
                to="/login"
                onClick={() => setOffCanvas(false)}
                style={{ 
                  width: "100%", 
                  textAlign: "center",
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  background: 'linear-gradient(135deg, #560CE3 0%, #7c3aed 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(86, 12, 227, 0.25)',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4a0ac8 0%, #6d28d9 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(86, 12, 227, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #560CE3 0%, #7c3aed 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(86, 12, 227, 0.25)';
                }}
              >
                <i
                  className="fa-regular fa-right-to-bracket"
                  style={{ fontSize: '16px' }}
                />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setOffCanvas(false)}
                style={{ 
                  width: "100%", 
                  textAlign: "center",
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  background: 'white',
                  color: '#560CE3',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  border: '2px solid #e8eaff',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9ff';
                  e.currentTarget.style.borderColor = '#560CE3';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(86, 12, 227, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e8eaff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i
                  className="fa-regular fa-user-plus"
                  style={{ fontSize: '16px' }}
                />
                <span>Sign up</span>
              </Link>
            </div>
          )}
          {/* ================================================= */}

          {/* SOCIALS */}
          <div className="social-links" style={{ 
            paddingTop: '20px',
            borderTop: '1px solid #e0e0e0',
            marginTop: 'auto'
          }}>
            <ul className="list-wrap" style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              margin: 0,
              padding: 0,
              listStyle: 'none'
            }}>
              <li>
                <Link 
                  to="#" 
                  onClick={() => setOffCanvas(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#f5f5f5',
                    color: '#560CE3',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#560CE3';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#560CE3';
                  }}
                >
                  <i className="fab fa-facebook-f"></i>
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  onClick={() => setOffCanvas(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#f5f5f5',
                    color: '#560CE3',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#560CE3';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#560CE3';
                  }}
                >
                  <i className="fab fa-instagram"></i>
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
