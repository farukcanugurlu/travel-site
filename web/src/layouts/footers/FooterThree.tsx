import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import settingsApi, { type SiteSettingsData } from '../../api/settings';

const FooterThree = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  useEffect(() => { settingsApi.getSettings().then(setSettings).catch(() => setSettings(null)); }, []);
  const logo = settings?.logo || settings?.logoUrl || '/assets/img/logo/logo-white.png';
  const companyDescription = settings?.companyDescription || 'Discover amazing travel experiences with LEXOR Travel. We offer carefully curated tours to destinations around the world.';
  const address = settings?.officeAddress || 'Antalya';
  const phone = settings?.phone || settings?.phone1 || '+90 500 000 00 00';
  const mapsLink = settings?.mapEmbedUrl || 'https://www.google.com/maps';
  const facebook = settings?.facebook || '#';
  const instagram = settings?.instagram || '#';
  const twitter = settings?.twitter || '#';
  const youtube = settings?.youtube || '#';
  return (
    <>
      <style>{`
        /* (TR) Kolon aralıklarını iyice daralt – soldaki sütunu ortadakine yaklaştır */
        .tg-footer-top .row.tight-gap { margin-left: -2px; margin-right: -2px; }
        .tg-footer-top .row.tight-gap > [class^="col-"],
        .tg-footer-top .row.tight-gap > [class*=" col-"] { padding-left: 2px; padding-right: 2px; }
        .footer-left-holder { margin-right: -12px; } /* sol sütunu Quick Links'e yaklaştır */

        /* (TR) Sol metin maksimum genişlik – fazla uzamasın */
        .tg-footer-widget .footer-intro { max-width: 260px; line-height: 1.7; }

        /* (TR) QUICK LINKS – başlık ve liste aynı sol çizgide */
        .tg-footer-link { text-align: left; }
        .tg-footer-link .tg-footer-widget-title { text-align: left; margin-left: 0; }
        .tg-footer-link ul { margin: 0; padding: 0; list-style: none; text-align: left; }
        .tg-footer-link ul li { margin: 6px 0; }

        /* (TR) INFORMATION – satırlar arası boşlukları azalt, ikonla düzgün hizala */
        .tg-footer-info ul { margin: 0; padding: 0; list-style: none; }
        .tg-footer-info ul li { display: block; margin: 8px 0; }
        .tg-footer-info .d-flex { align-items: center; }
        .tg-footer-info .mr-15 { margin-right: 12px; }
        .tg-footer-info p { margin: 0; }

        @media (max-width: 575.98px) {
          .tg-footer-widget .footer-intro { max-width: 100%; }
        }
      `}</style>

      <footer>
        <div
          className="tg-footer-area tg-footer-space include-bg"
          style={{ backgroundImage: `url(/assets/img/footer/footer.jpg)` }}
        >
          <div className="container">
            <div className="tg-footer-top mb-40">
              <div className="row tight-gap">
                {/* Left: logo + text + socials */}
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 footer-left-holder">
                  <div className="tg-footer-widget mb-40">
                    <div className="tg-footer-logo mb-20">
                      <Link to="/">
                        <img src={logo} alt="Lexor" />
                      </Link>
                    </div>

                    {companyDescription && (
                      <p className="mb-20 footer-intro">
                        {companyDescription}
                      </p>
                    )}

                    <div className="tg-footer-social">
                      <Link aria-label="Facebook" to={facebook || '#'}>
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                      <Link aria-label="Instagram" to={instagram || '#'}>
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                      <Link aria-label="Twitter" to={twitter || '#'}>
                        <i className="fa-brands fa-twitter"></i>
                      </Link>
                      <Link aria-label="YouTube" to={youtube || '#'}>
                        <i className="fa-brands fa-youtube"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Middle: Quick Links (title & list aligned left together) */}
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                  <div className="tg-footer-widget tg-footer-link mb-40">
                    <h3 className="tg-footer-widget-title mb-25">
                      Quick Links
                    </h3>
                    <ul>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/tours">Tours</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                      <li>
                        <Link to="/blog">Blog</Link>
                      </li>
                      <li>
                        <Link to="/about">About Us</Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right: Information */}
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                  <div className="tg-footer-widget tg-footer-info mb-40">
                    <h3 className="tg-footer-widget-title mb-25">
                      Information
                    </h3>
                    <ul>
                      <li>
                        <Link className="d-flex" to={mapsLink}>
                          <span className="mr-15">
                            <svg
                              width="20"
                              height="24"
                              viewBox="0 0 20 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19.0013 10.0608C19.0013 16.8486 10.3346 22.6668 10.3346 22.6668C10.3346 22.6668 1.66797 16.8486 1.66797 10.0608C1.66797 7.74615 2.58106 5.52634 4.20638 3.88965C5.83169 2.25297 8.03609 1.3335 10.3346 1.3335C12.6332 1.3335 14.8376 2.25297 16.4629 3.88965C18.0882 5.52634 19.0013 7.74615 19.0013 10.0608Z"
                                stroke="white"
                                strokeWidth="1.73333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.3346 12.9699C11.9301 12.9699 13.2235 11.6674 13.2235 10.0608C13.2235 8.45412 11.9301 7.15168 10.3346 7.15168C8.73915 7.15168 7.44575 8.45412 7.44575 10.0608C7.44575 11.6674 8.73915 12.9699 10.3346 12.9699Z"
                                stroke="white"
                                strokeWidth="1.73333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          {address}
                        </Link>
                      </li>

                      <li>
                        <Link className="d-flex" to={`tel:${phone}`}
                        >
                          <span className="mr-15">
                            <i className="fa-sharp text-white fa-solid fa-phone"></i>
                          </span>
                          {phone}
                        </Link>
                      </li>

                      <li className="d-flex">
                        <span className="mr-15">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.9987 5.60006V12.0001L16.2654 14.1334M22.6654 12.0002C22.6654 17.8912 17.8897 22.6668 11.9987 22.6668C6.10766 22.6668 1.33203 17.8912 1.33203 12.0002C1.33203 6.10912 6.10766 1.3335 11.9987 1.3335C17.8897 1.3335 22.6654 6.10912 22.6654 12.0002Z"
                              stroke="white"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <p>
                          Mon – Sat: 8 am – 5 pm, <br />
                          Sunday:{" "}
                          <span className="text-white d-inline-block">
                            CLOSED
                          </span>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="tg-footer-copyright text-center">
              <span>
                Copyright <Link to="#">©Lexor</Link> | All Right Reserved
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterThree;
