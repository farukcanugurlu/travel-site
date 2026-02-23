import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import settingsApi, { type SiteSettingsData } from '../../api/settings';
import { normalizeImageUrl } from '../../utils/imageUtils';

const FooterThree = () => {
  // İlk render'da cache'den oku (stock logo flash'ını önlemek için)
  const [settings, setSettings] = useState<SiteSettingsData | null>(() => {
    return settingsApi.getCachedSettingsSync();
  });
  
  useEffect(() => { 
    // Cache'den okuduktan sonra API'den güncel veriyi çek
    settingsApi.getSettings().then(setSettings).catch(() => setSettings(null)); 
  }, []);
  
  // Footer logo: önce footerLogo, yoksa logo
  const footerLogo = settings?.footerLogo 
    ? normalizeImageUrl(settings.footerLogo) 
    : (settings?.logo ? normalizeImageUrl(settings.logo) : null);
  const companyDescription = settings?.companyDescription || 'Discover amazing travel experiences with LEXOR Travel. We offer carefully curated tours to destinations around the world.';
  const address = settings?.officeAddress || 'Antalya';
  const phone = settings?.phone || '+90 500 000 00 00';
  const email = settings?.email || 'info@lexorholiday.com';
  const mapsLink = settings?.mapEmbedUrl || 'https://www.google.com/maps';
  const facebook = settings?.facebook || '#';
  const instagram = settings?.instagram || '#';
  const TURSAB_DDS_URL = 'https://www.tursab.org.tr/tr/ddsv';
  // TÜRSAB plaka bilgileri – statik (admin/DB’de tutulmuyor)
  const TURSAB_BELGE_NO = '8045';
  const TURSAB_SERI_NO = 'AH17R';
  const TURSAB_AGENCY_NAME = 'LEXOR HOLIDAY TRAVEL';

  return (
    <>
      <style>{`
        /* Footer base styles */
        footer,
        footer.tg-footer-area,
        footer > div,
        footer > div.tg-footer-area {
          position: relative !important;
          width: 100% !important;
          clear: both !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        
        body {
          min-height: auto !important;
          height: auto !important;
          position: relative !important;
        }
        
        html {
          height: auto !important;
          position: relative !important;
        }
        
        main {
          min-height: calc(100vh - 200px);
          padding-bottom: 60px !important;
          margin-bottom: 0 !important;
          position: relative !important;
          z-index: 1 !important;
        }
        
        main + footer {
          position: relative !important;
          margin-top: 0 !important;
          z-index: 0 !important;
        }
        
        /* Modern Footer Container */
        .modern-footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 60px 0 30px;
          position: relative;
          overflow: hidden;
        }
        
        .modern-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
        
        /* Footer Top Section */
        .footer-top {
          margin-bottom: 40px;
        }
        
        /* Equal spacing between columns - simetrik boşluklar */
        .footer-top .row {
          margin-left: -10px;
          margin-right: -10px;
        }
        
        .footer-top .row > [class*="col-"] {
          padding-left: 10px;
          padding-right: 10px;
        }
        
        /* Footer Widgets - Equal width columns */
        .footer-widget {
          margin-bottom: 30px;
        }
        
        .footer-widget-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 12px;
        }
        
        .footer-widget-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #ff6b6b, #ffa500);
          border-radius: 2px;
        }
        
        /* Logo Section */
        .footer-logo-section {
          margin-bottom: 20px;
        }
        
        .footer-logo {
          display: inline-block;
          max-width: 180px;
          margin-bottom: 18px;
        }
        
        .footer-logo img {
          max-width: 100%;
          height: auto;
          filter: brightness(1.1);
          transition: transform 0.3s ease;
        }
        
        .footer-logo:hover img {
          transform: scale(1.05);
        }
        
        .footer-description {
          color: rgba(255, 255, 255, 0.75);
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 25px;
          max-width: 280px;
          position: relative;
          padding: 20px 20px 20px 25px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .footer-description::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20px;
          bottom: 20px;
          width: 3px;
          background: linear-gradient(135deg, #ff6b6b, #ffa500);
          border-radius: 2px;
        }
        
        .footer-description::after {
          content: '✈';
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 24px;
          opacity: 0.15;
          transform: rotate(-15deg);
          pointer-events: none;
        }
        
        .footer-description:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .footer-description strong {
          color: #ffffff;
          font-weight: 600;
        }
        
        /* Social Links */
        .footer-social {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        
        .footer-social a {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #ffffff;
          font-size: 16px;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .footer-social a:hover {
          background: linear-gradient(135deg, #ff6b6b, #ffa500);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }

        /* Footer Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links li {
          margin-bottom: 10px;
        }
        
        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
          padding-left: 0;
        }
        
        .footer-links a::before {
          content: '→';
          position: absolute;
          left: -18px;
          opacity: 0;
          transition: all 0.3s ease;
          color: #ff6b6b;
        }
        
        .footer-links a:hover {
          color: #ffffff;
          padding-left: 18px;
        }
        
        .footer-links a:hover::before {
          opacity: 1;
          left: 0;
        }
        
        /* Contact Info */
        .footer-contact {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-contact li {
          margin-bottom: 15px;
          display: flex;
          align-items: flex-start;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.6;
        }
        
        .footer-contact-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          margin-top: 2px;
          flex-shrink: 0;
          color: #ff6b6b;
        }
        
        .footer-contact-text {
          flex: 1;
        }
        
        .footer-contact a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-contact a:hover {
          color: #ffffff;
        }
        
        /* Copyright + Pay Safe row */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 25px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        
        .footer-copyright {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          flex: 1;
          text-align: center;
          padding: 0 16px;
        }
        
        .footer-copyright a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-copyright a:hover {
          color: #ff6b6b;
        }
        
        .footer-bottom-left {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        /* TÜRSAB plaka / sertifika rozeti - sol alt */
        .footer-tursab {
          display: inline-flex;
          text-decoration: none;
          background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
          border-radius: 8px;
          padding: 14px 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          max-width: 260px;
          border: 2px solid #c41e3a;
        }
        
        .footer-tursab:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        
        .tursab-inner {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }
        
        .tursab-logo {
          font-size: 20px;
          font-weight: 700;
          color: #c41e3a;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }
        
        .tursab-org {
          font-size: 8px;
          color: #555;
          line-height: 1.3;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        
        .tursab-agency {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: 0.03em;
          line-height: 1.2;
          margin: 2px 0;
        }
        
        .tursab-numbers {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 16px;
          font-size: 11px;
          color: #333;
          margin-top: 4px;
        }
        
        .tursab-numbers span {
          font-weight: 600;
        }
        
        .tursab-verify {
          font-size: 9px;
          color: #666;
          line-height: 1.4;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        
        .tursab-verify strong {
          color: #c41e3a;
        }
        
        /* Pay Safe - bottom right */
        .footer-pay-safe {
          text-align: right;
        }
        
        .pay-safe-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
        }
        
        .pay-safe-text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          margin: 0 0 14px 0;
          max-width: 280px;
        }
        
        .pay-safe-logos {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          flex-wrap: wrap;
        }
        
        .pay-safe-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          flex-shrink: 0;
        }
        
        .pay-safe-logo svg {
          height: 100%;
          width: auto;
          max-width: 56px;
          object-fit: contain;
        }
        
        .pay-safe-logo-amex svg {
          max-width: 52px;
        }
        
        /* Responsive Design */
        @media (max-width: 991.98px) {
          .modern-footer {
            padding: 50px 0 25px;
          }
          
          .footer-widget {
            margin-bottom: 35px;
          }
          
          .footer-description {
            max-width: 100%;
          }
        }
        
        @media (max-width: 767.98px) {
          .modern-footer {
            padding: 40px 0 20px;
          }
          
          .footer-widget-title {
            font-size: 16px;
            margin-bottom: 15px;
          }
          
          .footer-logo {
            max-width: 150px;
          }
          
          .footer-social {
            gap: 10px;
          }
          
          .footer-social a {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 767.98px) {
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .footer-copyright {
            flex: none;
            order: 2;
          }
          
          .footer-bottom-left {
            flex-direction: column;
            align-items: center;
            order: 1;
          }
          
          .footer-pay-safe {
            order: 3;
            text-align: center;
          }
          
          .footer-tursab {
            max-width: 240px;
          }
          
          .pay-safe-text {
            margin-left: auto;
            margin-right: auto;
          }
          
          .pay-safe-logos {
            justify-content: center;
          }
        }
        
        @media (max-width: 575.98px) {
          .modern-footer {
            padding: 35px 0 20px;
          }
          
          .footer-top {
            margin-bottom: 30px;
          }
          
          .footer-widget {
            margin-bottom: 30px;
          }
          
          .pay-safe-title {
            font-size: 16px;
          }
          
          .pay-safe-logos {
            gap: 12px;
          }
          
          .pay-safe-logo {
            height: 24px;
          }
        }
      `}</style>

      <footer>
        <div className="modern-footer">
          <div className="container">
            <div className="footer-top">
              <div className="row">
                {/* Column 1: Logo & Description */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer-widget footer-logo-section">
                    {footerLogo && (
                      <div className="footer-logo">
                        <Link to="/">
                          <img src={footerLogo} alt="Lexor Holiday" />
                        </Link>
                      </div>
                    )}
                    {companyDescription && (
                      <div className="footer-description">
                        {companyDescription}
                      </div>
                    )}
                    <div className="footer-social">
                      {facebook && (
                        <Link to={facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                      )}
                      {instagram && (
                        <Link to={instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer-widget">
                    <h3 className="footer-widget-title">Quick Links</h3>
                    <ul className="footer-links">
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/tours">Tours</Link>
                      </li>
                      <li>
                        <Link to="/about">About Us</Link>
                      </li>
                      <li>
                        <Link to="/blog">Blog</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Column 3: Information */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer-widget">
                    <h3 className="footer-widget-title">Information</h3>
                    <ul className="footer-contact">
                      <li>
                        <svg className="footer-contact-icon" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.0013 10.0608C19.0013 16.8486 10.3346 22.6668 10.3346 22.6668C10.3346 22.6668 1.66797 16.8486 1.66797 10.0608C1.66797 7.74615 2.58106 5.52634 4.20638 3.88965C5.83169 2.25297 8.03609 1.3335 10.3346 1.3335C12.6332 1.3335 14.8376 2.25297 16.4629 3.88965C18.0882 5.52634 19.0013 7.74615 19.0013 10.0608Z" stroke="currentColor" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.3346 12.9699C11.9301 12.9699 13.2235 11.6674 13.2235 10.0608C13.2235 8.45412 11.9301 7.15168 10.3346 7.15168C8.73915 7.15168 7.44575 8.45412 7.44575 10.0608C7.44575 11.6674 8.73915 12.9699 10.3346 12.9699Z" stroke="currentColor" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        <span className="footer-contact-text">
                          <Link to={mapsLink} target="_blank" rel="noopener noreferrer">
                          {address}
                        </Link>
                        </span>
                      </li>
                      <li>
                        <i className="fa-sharp fa-solid fa-phone footer-contact-icon"></i>
                        <span className="footer-contact-text">
                          <Link to={`tel:${phone}`}>{phone}</Link>
                        </span>
                      </li>
                      <li>
                        <i className="fa-sharp fa-solid fa-envelope footer-contact-icon"></i>
                        <span className="footer-contact-text">
                          <Link to={`mailto:${email}`}>{email}</Link>
                          </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Column 4: Support */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer-widget">
                    <h3 className="footer-widget-title">Support</h3>
                    <ul className="footer-links">
                      <li>
                        <Link to="/contact">Contact Us</Link>
                      </li>
                      <li>
                        <Link to="/about">About Us</Link>
                      </li>
                      <li>
                        <Link to="/tours">Our Tours</Link>
                      </li>
                      <li>
                        <Link to="/blog">Travel Blog</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* TÜRSAB | Copyright | Pay Safe */}
            <div className="footer-bottom">
              <div className="footer-bottom-left">
                <a
                  className="footer-tursab"
                  href={TURSAB_DDS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TÜRSAB Digital Verification - Verify our agency"
                >
                  <div className="tursab-inner">
                    <span className="tursab-logo">TÜRSAB</span>
                    <span className="tursab-org">Association of Turkish Travel Agencies</span>
                    <span className="tursab-agency">{TURSAB_AGENCY_NAME}</span>
                    <div className="tursab-numbers">
                      <span>Certificate No: <strong>{TURSAB_BELGE_NO}</strong></span>
                      <span>Serial No: <strong>{TURSAB_SERI_NO}</strong></span>
                    </div>
                    <span className="tursab-verify">
                      Click to verify our agency with <strong>TÜRSAB</strong> Digital Verification.
                    </span>
                  </div>
                </a>
              </div>
              <div className="footer-copyright">
                <span>
                  Copyright <Link to="/">© {new Date().getFullYear()} Lexor Holiday</Link> | All Rights Reserved
                </span>
              </div>
              <div className="footer-pay-safe">
                <h4 className="pay-safe-title">Pay Safe</h4>
                <p className="pay-safe-text">
                  All payments are encrypted and transmitted securely with an SSL protocol.
                </p>
                <div className="pay-safe-logos" aria-label="Accepted payment methods">
                  <span className="pay-safe-logo" title="Visa">
                    <svg viewBox="0 0 52 18" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visa">
                      <rect width="52" height="18" rx="2" fill="#1A1F71"/>
                      <text x="26" y="13" textAnchor="middle" fill="white" fontSize="11" fontFamily="Arial,sans-serif" fontWeight="bold">VISA</text>
                    </svg>
                  </span>
                  <span className="pay-safe-logo" title="Mastercard">
                    <svg viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard">
                      <circle cx="14" cy="12" r="8" fill="#EB001B"/>
                      <circle cx="26" cy="12" r="8" fill="#F79E1B"/>
                      <path d="M20 6.5C21.8 8.3 23 10.5 23 12C23 13.5 21.8 15.7 20 17.5C18.2 15.7 17 13.5 17 12C17 10.5 18.2 8.3 20 6.5Z" fill="#FF5F00"/>
                    </svg>
                  </span>
                  <span className="pay-safe-logo pay-safe-logo-amex" title="American Express">
                    <svg viewBox="0 0 52 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="American Express">
                      <rect width="52" height="24" rx="2" fill="#006FCF"/>
                      <text x="26" y="15.5" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial,sans-serif" fontWeight="bold">AMEX</text>
                    </svg>
                  </span>
                  <span className="pay-safe-logo" title="JCB">
                    <svg viewBox="0 0 52 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JCB">
                      <rect width="52" height="24" rx="2" fill="#0E4C96"/>
                      <rect x="6" y="5" width="8" height="14" fill="#0E4C96" stroke="white" strokeWidth="1"/>
                      <rect x="15" y="5" width="8" height="14" fill="#E5252B" stroke="white" strokeWidth="1"/>
                      <rect x="24" y="5" width="8" height="14" fill="#00A550" stroke="white" strokeWidth="1"/>
                      <text x="40" y="15" fill="white" fontSize="9" fontFamily="Arial,sans-serif" fontWeight="bold">JCB</text>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterThree;
