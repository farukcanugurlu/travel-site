import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import settingsApi, { type SiteSettingsData } from '../../../api/settings';
import { normalizeImageUrl } from '../../../utils/imageUtils';

interface SidebarProps {
  sidebar: boolean;
  setSidebar: (open: boolean) => void;
}

const Sidebar = ({ sidebar, setSidebar }: SidebarProps) => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  useEffect(() => { settingsApi.getSettings().then(setSettings).catch(() => setSettings(null)); }, []);
  const address = settings?.officeAddress || 'Antalya';
  const phone = settings?.phone || '+90 500 000 00 00';
  const email = settings?.email || 'info@lexor.com';
  const facebook = settings?.facebook || '/';
  const instagram = settings?.instagram || '/';
  const twitter = settings?.twitter || '/';
  const youtube = settings?.youtube || '/';
  // Sidebar logo: önce sidebarLogo, yoksa logo, yoksa default
  const sidebarLogo = settings?.sidebarLogo 
    ? normalizeImageUrl(settings.sidebarLogo) 
    : (settings?.logo 
      ? normalizeImageUrl(settings.logo) 
      : "/assets/img/logo/logo-green.png");
  return (
    <>
      <div className={`offCanvas__info ${sidebar ? "active" : ""}`}>
        <div className="offCanvas__close-icon menu-close">
          <button onClick={() => setSidebar(false)}>
            <i className="fa-sharp fa-regular fa-xmark"></i>
          </button>
        </div>

        {/* LOGO */}
        <div className="offCanvas__logo mb-30">
          <Link to="/" onClick={() => setSidebar(false)}>
            <img src={sidebarLogo} alt="Logo" />
          </Link>
        </div>

        {/* İletişim alanları */}
        <div className="offCanvas__side-info mb-30">
          <div className="contact-list mb-30">
            <h4>Office Address</h4>
            <p>{address}</p>
          </div>
          <div className="contact-list mb-30">
            <h4>Phone Number</h4>
            <p>{phone}</p>
          </div>
          <div className="contact-list mb-30">
            <h4>Email Address</h4>
            <p>{email}</p>
          </div>
        </div>

        {/* Sosyal ikonlar */}
        <div className="offCanvas__social-icon mt-30">
          <Link aria-label="Facebook" to={facebook} onClick={() => setSidebar(false)}>
            <i className="fa-brands fa-facebook-f"></i>
          </Link>
          <Link aria-label="Instagram" to={instagram} onClick={() => setSidebar(false)}>
            <i className="fa-brands fa-instagram"></i>
          </Link>
        </div>
      </div>

      {/* overlay */}
      <div
        onClick={() => setSidebar(false)}
        className={`offCanvas__overly ${sidebar ? "active" : ""}`}
      />
    </>
  );
};

export default Sidebar;
