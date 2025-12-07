import { Link } from "react-router-dom"
import Button from "../../common/Button"
import { useEffect, useState } from "react";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";
import { normalizeImageUrl } from "../../../utils/imageUtils";

const About = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.getSettings()
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  const popularTourSubtitle = settings?.popularTourSubtitle || "Most Popular Tour";
  const popularTourTitle = settings?.popularTourTitle || "Let's Discover The World With Our Excellent Eyes";
  const popularTourDescription = settings?.popularTourDescription || "Whether you're looking for a romantic getaway, family-friendly solo journey to explore the world, a travel agency can provide tailored itinerary that exceeds your expectations.";
  
  // Only use uploaded images, no default template images
  const aboutLogo = settings?.aboutLogo ? normalizeImageUrl(settings.aboutLogo) : null;
  const aboutLeftImage1 = settings?.aboutLeftImage1 ? normalizeImageUrl(settings.aboutLeftImage1) : null;
  const aboutLeftImage2 = settings?.aboutLeftImage2 ? normalizeImageUrl(settings.aboutLeftImage2) : null;
  const aboutRightImage1 = settings?.aboutRightImage1 ? normalizeImageUrl(settings.aboutRightImage1) : null;
  const aboutRightImage2 = settings?.aboutRightImage2 ? normalizeImageUrl(settings.aboutRightImage2) : null;

  return (
    <div className="tg-about-area pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="tg-about-thumb-wrap mb-30">
              {!loading && aboutLeftImage1 ? (
                <img className="w-100 tg-round-15 mb-85 wow fadeInLeft" data-wow-delay=".3s" data-wow-duration=".7s" src={aboutLeftImage1} alt="about" />
              ) : !loading ? (
                <div className="w-100 tg-round-15 mb-85" style={{
                  height: '200px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '14px',
                  borderRadius: '15px'
                }}>
                  No image
                </div>
              ) : null}
              {!loading && aboutLeftImage2 ? (
                <img className="tg-about-thumb-2 tg-round-15 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".9s" src={aboutLeftImage2} alt="about" />
              ) : !loading ? (
                <div className="tg-about-thumb-2 tg-round-15" style={{
                  height: '150px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '14px',
                  borderRadius: '15px'
                }}>
                  No image
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-lg-6 mb-30">
            <div className="tg-about-content text-center">
              {!loading && aboutLogo ? (
                <div className="tg-about-logo mb-30 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".5s">
                  <img src={aboutLogo} alt="logo" />
                </div>
              ) : null}
              <div className="tg-about-section-title mb-25">
                <h5 className="tg-section-subtitle wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".6s">{popularTourSubtitle}</h5>
                <h2 className="mb-15 wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".7s">{popularTourTitle}</h2>
                <p className="text-capitalize wow fadeInUp" data-wow-delay=".6s" data-wow-duration=".8s">{popularTourDescription}</p>
              </div>
              <div className="tp-about-btn-wrap wow fadeInUp" data-wow-delay=".7s" data-wow-duration=".9s">
                <Link to="/tours" className="tg-btn tg-btn-transparent tg-btn-switch-animation">
                  <Button text="Take a Tour" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="tg-about-thumb-wrap  mb-30">
              {!loading && aboutRightImage1 ? (
                <img className="w-100 tg-round-15 mb-85 wow fadeInRight" data-wow-delay=".3s" data-wow-duration=".7s" src={aboutRightImage1} alt="about" />
              ) : !loading ? (
                <div className="w-100 tg-round-15 mb-85" style={{
                  height: '200px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '14px',
                  borderRadius: '15px'
                }}>
                  No image
                </div>
              ) : null}
              {!loading && aboutRightImage2 ? (
                <img className="tg-about-thumb-4 tg-round-15 wow fadeInRight" data-wow-delay=".4s" data-wow-duration=".9s" src={aboutRightImage2} alt="about" />
              ) : !loading ? (
                <div className="tg-about-thumb-4 tg-round-15" style={{
                  height: '150px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '14px',
                  borderRadius: '15px'
                }}>
                  No image
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
