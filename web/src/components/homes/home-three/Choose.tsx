import { Link } from "react-router-dom";
import Choose4 from "../../../svg/home-one/Choose4";
import Choose5 from "../../../svg/home-one/Choose5";
import Button from "../../common/Button";
import { useEffect, useState } from "react";
import settingsApi, { type SiteSettingsData } from "../../../api/settings";

const Choose = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const chooseSubtitle = settings?.chooseSubtitle || "Choose Your Dream Tour With Us";
  const chooseTitle = settings?.chooseTitle || "discover when even<br /> you want to go";
  const chooseDescription = settings?.chooseDescription || "Are you tired of the typical tourist destinations and looking to step out of your comfort zone? Adventure travel may be the perfect solution for you! Here are four.";
  const chooseFeature1Title = settings?.chooseFeature1Title || "Best Travel Agency";
  const chooseFeature1Description = settings?.chooseFeature1Description || "Are you tired of the typical tourist destinatio and looking step out of your comfort.";
  const chooseFeature2Title = settings?.chooseFeature2Title || "Secure Journey With Us";
  const chooseFeature2Description = settings?.chooseFeature2Description || "Are you tired of the typical tourist destinatio and looking step out of your comfort.";
  const chooseButtonText = settings?.chooseButtonText || "BOOK YOUR TRIP";
  const chooseImage1 = settings?.chooseImage1 || "/assets/img/chose/chose.png";
  const chooseImage2 = settings?.chooseImage2 || "/assets/img/chose/chose-2.jpg";

  return (
    <div className="tg-chose-area p-relative pt-160 pb-100">
      <img
        className="tg-chose-shape p-absolute"
        src="/assets/img/chose/chose-shape-2.png"
        alt="shape"
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="tg-chose-content mb-25">
              <div className="tg-chose-section-title mb-30">
                <h5
                  className="tg-section-subtitle mb-15 wow fadeInUp"
                  data-wow-delay=".3s"
                  data-wow-duration=".1s"
                >
                  {chooseSubtitle}
                </h5>
                <h2
                  className="mb-15 text-capitalize wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".9s"
                  dangerouslySetInnerHTML={{ __html: chooseTitle }}
                />
                <p
                  className="text-capitalize wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  {chooseDescription}
                </p>
              </div>
              <div className="tg-chose-list-wrap">
                <div
                  className="tg-chose-list d-flex mb-15 wow fadeInUp"
                  data-wow-delay=".6s"
                  data-wow-duration=".9s"
                >
                  <span className="tg-chose-list-icon mr-20">
                    <Choose4 />
                  </span>
                  <div className="tg-chose-list-content">
                    <h4 className="tg-chose-list-title mb-5">
                      {chooseFeature1Title}
                    </h4>
                    <p>
                      {chooseFeature1Description}
                    </p>
                  </div>
                </div>
                <div
                  className="tg-chose-list d-flex mb-40 wow fadeInUp"
                  data-wow-delay=".7s"
                  data-wow-duration=".9s"
                >
                  <span className="tg-chose-list-icon mr-20">
                    <Choose5 />
                  </span>
                  <div className="tg-chose-list-content">
                    <h4 className="tg-chose-list-title mb-5">
                      {chooseFeature2Title}
                    </h4>
                    <p>
                      {chooseFeature2Description}
                    </p>
                  </div>
                </div>
                <div
                  className="tg-chose-btn wow fadeInUp"
                  data-wow-delay=".8s"
                  data-wow-duration=".9s"
                >
                  <Link to="/tours" className="tg-btn tg-btn-switch-animation">
                    <Button text={chooseButtonText} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="tg-chose-right mb-25">
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="tg-chose-thumb">
                    <img
                      className="tg-chose-shape-2 mb-30 ml-15 d-none d-lg-block"
                      src="/assets/img/chose/chose-shape.png"
                      alt="shape"
                    />
                    <img
                      className="w-100 wow fadeInRight"
                      data-wow-delay=".4s"
                      data-wow-duration=".9s"
                      src={chooseImage1}
                      alt="chose"
                    />
                  </div>
                </div>
                <div className="col-lg-9 col-md-6">
                  <div className="tg-chose-thumb-inner p-relative">
                    <div
                      className="tg-chose-thumb-2 wow fadeInRight"
                      data-wow-delay=".5s"
                      data-wow-duration=".9s"
                    >
                      <img
                        className="w-100 tg-round-15"
                        src={chooseImage2}
                        alt="chose"
                      />
                    </div>
                    <div className="tg-chose-big-text d-none d-xl-block">
                      <h2 data-text="TRAVEL">TRAVEL</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
