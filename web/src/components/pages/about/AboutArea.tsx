import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../common/Button";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";
import { normalizeImageUrl } from "../../../utils/imageUtils";

const AboutArea = () => {
   const [settings, setSettings] = useState<SiteSettingsData | null>(null);

   useEffect(() => {
      const loadSettings = async () => {
         try {
            const data = await settingsApi.getSettings();
            setSettings(data || null);
         } catch (error) {
            console.error('Error loading settings:', error);
         }
      };
      loadSettings();
   }, []);

   const subtitle = settings?.aboutPageSubtitle || "Explore the world with us";
   const title = settings?.aboutPageTitle || "The perfect vacation come true with our Travel Agency";
   const description = settings?.aboutPageDescription || "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting remaining essentially unchanged.";
   const buttonText = settings?.aboutPageButtonText || "Book Your Room";
   const image1 = settings?.aboutPageImage1 ? normalizeImageUrl(settings.aboutPageImage1) : "/assets/img/about/details/thumb-1.jpg";
   const image2 = settings?.aboutPageImage2 ? normalizeImageUrl(settings.aboutPageImage2) : "/assets/img/about/details/thumb-2.jpg";
   const image3 = settings?.aboutPageImage3 ? normalizeImageUrl(settings.aboutPageImage3) : "/assets/img/about/details/thumb-3.jpg";

   return (
      <div className="tg-about-area p-relative z-index-1 pt-140 pb-105">
         <img className="tg-about-details-shape p-absolute d-none d-lg-block" src="/assets/img/about/details/shape.png" alt="shape" />
         <div className="container">
            <div className="row align-items-center">
               <div className="col-lg-6">
                  <div className="tg-about-details-left p-relative mb-15">
                     <img className="tg-about-details-map p-absolute" src="/assets/img/about/details/shape-2.png" alt="map" />
                     <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                           <div className="tg-about-details-thumb p-relative z-index-9">
                              <img className="main-thumb tg-round-15 w-100 mb-20" src={image1} alt="thumb" />
                              <img className="main-thumb tg-round-15 w-100 mb-20" src={image3} alt="thumb" />
                           </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                           <div className="tg-about-details-thumb-2 p-relative">
                              <div className="tg-chose-3-rounded p-relative mb-30">
                                 <img className="rotate-infinite-2" src="/assets/img/chose/chose-3/circle-text.png" alt="" />
                                 <img className="tg-chose-3-star" src="/assets/img/chose/chose-3/star.png" alt="" />
                              </div>
                              <img className="w-100 tg-round-15" src={image2} alt="chose" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-lg-6">
                  <div className="tg-chose-content mb-35 ml-60">
                     <div className="tg-chose-section-title mb-30">
                        <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".1s">{subtitle}</h5>
                        <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">{title}</h2>
                        <p className="text-capitalize wow fadeInUp mb-35" data-wow-delay=".5s" data-wow-duration=".9s">{description}</p>
                        <div className="tg-chose-btn wow fadeInUp" data-wow-delay=".8s" data-wow-duration=".9s">
                           <Link to="/tours" className="tg-btn tg-btn-switch-animation">
                              <Button text={buttonText} />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AboutArea
