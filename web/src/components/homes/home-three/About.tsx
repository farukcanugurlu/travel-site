import { Link } from "react-router-dom"
import Button from "../../common/Button"
import { useEffect, useState } from "react";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";

const About = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const popularTourSubtitle = settings?.popularTourSubtitle || "Most Popular Tour";
  const popularTourTitle = settings?.popularTourTitle || "Let's Discover The World With Our Excellent Eyes";
  const popularTourDescription = settings?.popularTourDescription || "Whether you're looking for a romantic getaway, family-friendly solo journey to explore the world, a travel agency can provide tailored itinerary that exceeds your expectations.";
  const aboutLogo = settings?.aboutLogo || "/assets/img/about/logo.png";
  const aboutLeftImage1 = settings?.aboutLeftImage1 || "/assets/img/about/about.jpg";
  const aboutLeftImage2 = settings?.aboutLeftImage2 || "/assets/img/about/about-2.jpg";
  const aboutRightImage1 = settings?.aboutRightImage1 || "/assets/img/about/about-3.jpg";
  const aboutRightImage2 = settings?.aboutRightImage2 || "/assets/img/about/about-4.jpg";

  return (
    <div className="tg-about-area pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="tg-about-thumb-wrap mb-30">
              <img className="w-100 tg-round-15 mb-85 wow fadeInLeft" data-wow-delay=".3s" data-wow-duration=".7s" src={aboutLeftImage1} alt="about" />
              <img className="tg-about-thumb-2 tg-round-15 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".9s" src={aboutLeftImage2} alt="about" />
            </div>
          </div>
          <div className="col-lg-6 mb-30">
            <div className="tg-about-content text-center">
              <div className="tg-about-logo mb-30 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".5s">
                <img src={aboutLogo} alt="logo" />
              </div>
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
              <img className="w-100 tg-round-15 mb-85 wow fadeInRight" data-wow-delay=".3s" data-wow-duration=".7s" src={aboutRightImage1} alt="about" />
              <img className="tg-about-thumb-4 tg-round-15 wow fadeInRight" data-wow-delay=".4s" data-wow-duration=".9s" src={aboutRightImage2} alt="about" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
