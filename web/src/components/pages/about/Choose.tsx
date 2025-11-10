import { useEffect, useState } from "react";
import type { JSX } from "react";
import Choose6 from "../../../svg/home-one/Choose6";
import Choose7 from "../../../svg/home-one/Choose7";
import Choose8 from "../../../svg/home-one/Choose8";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";

interface DataType {
   id: number;
   icon: JSX.Element;
   title: string;
   desc: string;
}

const Choose = () => {
   const [settings, setSettings] = useState<SiteSettingsData | null>(null);

   useEffect(() => {
      settingsApi.getSettings().then(setSettings).catch(() => setSettings(null));
   }, []);

   const subtitle = settings?.chooseSubtitle || "What we do";
   const title = settings?.chooseTitle || "We Arrange the Best Tour Ever Possible";
   const description = settings?.chooseDescription || "when an unknown printer took a galley of type and scrambled make type specimen bookhas survived not only five.";
   
   const choose_data: DataType[] = [
      {
         id: 1,
         icon: (<><Choose6 /></>),
         title: settings?.chooseFeature1Title || "Ultimate flexibility",
         desc: settings?.chooseFeature1Description || "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
      },
      {
         id: 2,
         icon: (<><Choose7 /></>),
         title: settings?.chooseFeature2Title || "Memorable experiences",
         desc: settings?.chooseFeature2Description || "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
      },
      {
         id: 3,
         icon: (<><Choose8 /></>),
         title: settings?.chooseFeature3Title || "Award winning support",
         desc: settings?.chooseFeature3Description || "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
      },
   ];

   return (
      <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
         <img className="tg-chose-6-shape d-none d-md-block" src="/assets/img/banner/banner-2/shape.png" alt="" />
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7 col-md-9">
                  <div className="tg-chose-section-title text-center mb-35">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".1s">{subtitle}</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">{title}</h2>
                     <p className="text-capitalize wow fadeInUp mb-35" data-wow-delay=".5s" data-wow-duration=".9s">{description}</p>
                  </div>
               </div>
            </div>
            <div className="row">
               {choose_data.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                     <div className="tg-chose-6-wrap mb-30">
                        <span className="icon mb-20">{item.icon}</span>
                        <h4 className="tg-chose-6-title mb-15">{item.title}</h4>
                        <p>{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Choose
