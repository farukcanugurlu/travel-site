import { Link } from "react-router-dom";
import ContactForm from "../forms/ContactForm";
import { useEffect, useState } from 'react';
import settingsApi, { type SiteSettingsData } from '../../api/settings';

const ContactArea = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  useEffect(() => { settingsApi.getSettings().then(setSettings).catch(() => setSettings(null)); }, []);
  
  // Dynamic data from settings (consistent with footer/sidebar)
  const phone = settings?.phone || '+123 9998 000';
  const email = settings?.email || 'info@lexor.com';
  const address = settings?.officeAddress || 'Antalya';
  
  // Validate and format map embed URL
  const defaultMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31078.361591144112!2d-74.0256365664179!3d40.705584751235754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1724572184688!5m2!1sen!2sbd';
  
  const getMapUrl = (): string => {
    const mapUrl = settings?.mapEmbedUrl;
    
    // If no URL provided, use default
    if (!mapUrl || mapUrl.trim() === '') {
      return defaultMapUrl;
    }
    
    let trimmedUrl = mapUrl.trim();
    
    // Extract URL from iframe code if user pasted full iframe HTML
    const iframeMatch = trimmedUrl.match(/src=["']([^"']+)["']/);
    if (iframeMatch) {
      trimmedUrl = iframeMatch[1];
    } else {
      // Extract URL if it's wrapped in quotes or other characters
      const urlMatch = trimmedUrl.match(/https?:\/\/[^\s"'<>]+/);
      if (urlMatch) {
        trimmedUrl = urlMatch[0];
      }
    }
    
    // If URL is already an embed URL (contains /maps/embed), use it directly
    if (trimmedUrl.includes('/maps/embed') || trimmedUrl.startsWith('https://www.google.com/maps/embed')) {
      return trimmedUrl;
    }
    
    // If it's a regular Google Maps URL (not embed), warn and use default
    // User should use embed URL from Google Maps "Share" > "Embed a map"
    if (trimmedUrl.includes('google.com/maps')) {
      console.warn('Regular Google Maps URL detected. Please use embed URL from Google Maps "Share" > "Embed a map". Using default map.');
      return defaultMapUrl;
    }
    
    // If URL doesn't look like Google Maps, return default
    console.warn('Invalid map URL format. Using default map.');
    return defaultMapUrl;
  };
  
  const map = getMapUrl();
  
  // Format phone number for WhatsApp (remove spaces, dashes, keep only numbers and +)
  const formatPhoneForWhatsApp = (phoneNumber: string): string => {
    // Remove all spaces, dashes, parentheses, and keep only numbers and +
    return phoneNumber.replace(/[\s\-\(\)]/g, '');
  };
  
  const whatsappPhone = formatPhoneForWhatsApp(phone);
  const whatsappUrl = `https://wa.me/${whatsappPhone}`;

  return (
    <div className="tg-contact-area pt-130 p-relative z-index-1 pb-100">
      <img
        className="tg-team-shape-2 d-none d-md-block"
        src="/assets/img/banner/banner-2/shape.png"
        alt=""
      />
      <div className="container">
        {/* stretch both columns to equal height */}
        <div className="row align-items-stretch">
          {/* LEFT: Information */}
          <div className="col-lg-5 d-flex">
            <div
              className="tg-team-details-contant tg-contact-info-wrap mb-30 w-100"
              style={{ height: "100%" }}
            >
              <h6 className="mb-15">Information:</h6>
              <p className="mb-25">
                For any questions regarding tours, bookings or partnerships,
                feel free to reach us.
              </p>
              <div className="tg-team-details-contact-info mb-35">
                <div className="tg-team-details-contact">
                  <div className="item">
                    <span>Phone :</span>
                    <Link to={`tel:${phone}`}> {phone}</Link>
                  </div>
                  <div className="item">
                    <span>E-mail :</span>
                    <Link to={`mailto:${email}`}> {email}</Link>
                  </div>
                  <div className="item">
                    <span>Address :</span>
                    <Link to="#"> {address}</Link>
                  </div>
                </div>
              </div>

              <div className="tg-contact-map h-100">
                <iframe
                  title="map"
                  src={map}
                  width="600"
                  height="450"
                  style={{ border: "0" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="col-lg-7 d-flex">
            <div className="tg-contact-content-wrap ml-40 mb-30 w-100">
              <h3 className="tg-contact-title mb-15">Let&apos;s Connect</h3>
              <p className="mb-30">
                Tell us more about your request. We usually respond within 24
                hours.
              </p>
              <div className="tg-contact-form tg-tour-about-review-form">
                <ContactForm />
              </div>
              
              {/* WhatsApp Button */}
              <div className="tg-whatsapp-contact mt-30">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tg-btn tg-btn-whatsapp"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>Contact us on WhatsApp</span>
                </a>
                <p className="whatsapp-note mt-15">
                  Or call us directly: <Link to={`tel:${phone}`}>{phone}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .tg-whatsapp-contact {
          text-align: center;
        }
        .tg-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #25D366;
          color: #fff;
          padding: 14px 28px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .tg-btn-whatsapp:hover {
          background: #20BA5A;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }
        .tg-btn-whatsapp i {
          font-size: 20px;
        }
        .whatsapp-note {
          font-size: 14px;
          color: #666;
          margin-top: 15px;
        }
        .whatsapp-note a {
          color: var(--tg-theme-1, #7f0af5);
          text-decoration: none;
          font-weight: 500;
        }
        .whatsapp-note a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ContactArea;
