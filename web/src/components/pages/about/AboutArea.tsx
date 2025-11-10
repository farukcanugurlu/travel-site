import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Button from "../../common/Button";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";
import { normalizeImageUrl } from "../../../utils/imageUtils";

const AboutArea = () => {
   const [settings, setSettings] = useState<SiteSettingsData | null>(null);
   const leftThumbRef = useRef<HTMLDivElement>(null);
   const rightThumbRef = useRef<HTMLDivElement>(null);

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

   useEffect(() => {
      const setRightHeight = () => {
         if (leftThumbRef.current && rightThumbRef.current) {
            // Get the actual content height (excluding bottom margin of last image)
            const leftHeight = leftThumbRef.current.offsetHeight;
            // Subtract the bottom margin (mb-20 = 20px) from the last image
            const adjustedHeight = leftHeight - 20;
            rightThumbRef.current.style.height = `${adjustedHeight}px`;
         }
      };

      // Set height after images load
      const timer = setTimeout(setRightHeight, 100);
      window.addEventListener('resize', setRightHeight);

      return () => {
         clearTimeout(timer);
         window.removeEventListener('resize', setRightHeight);
      };
   }, [settings]);

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
                           <div className="tg-about-details-thumb p-relative z-index-9" ref={leftThumbRef}>
                               <img className="main-thumb tg-round-15 w-100 mb-20" src={image1} alt="thumb" onLoad={() => {
                                  if (leftThumbRef.current && rightThumbRef.current) {
                                     const leftHeight = leftThumbRef.current.offsetHeight;
                                     // Subtract the bottom margin (mb-20 = 20px) from the last image
                                     const adjustedHeight = leftHeight - 20;
                                     rightThumbRef.current.style.height = `${adjustedHeight}px`;
                                  }
                               }} />
                               <img className="main-thumb tg-round-15 w-100 mb-20" src={image3} alt="thumb" onLoad={() => {
                                  if (leftThumbRef.current && rightThumbRef.current) {
                                     const leftHeight = leftThumbRef.current.offsetHeight;
                                     // Subtract the bottom margin (mb-20 = 20px) from the last image
                                     const adjustedHeight = leftHeight - 20;
                                     rightThumbRef.current.style.height = `${adjustedHeight}px`;
                                  }
                               }} />
                           </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                           <div className="tg-about-details-thumb-2 p-relative" ref={rightThumbRef}>
                              <img className="w-100 tg-round-15" style={{ height: '100%', objectFit: 'cover' }} src={image2} alt="chose" />
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
