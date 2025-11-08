// src/pages/HotelGridTwoMain.tsx
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import HeaderThree from "../layouts/headers/HeaderThree";
import FooterThree from "../layouts/footers/FooterThree";

import FeatureArea from "../components/features/feature-two/FeatureArea";
import BannerFormTwo from "../components/common/banner-form/BannerFormTwo";

const HotelGridTwoMain = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Tours" />
      <HeaderThree />
      <main className="lexor-tours-page">
        <style>{`
          /* (TR) Mobilde header'ı transparan yap (tours sayfası için) */
          @media (max-width: 1199px) {
            header.tg-header-height {
              position: absolute !important;
              top: 0;
              left: 0;
              right: 0;
              width: 100%;
              z-index: 9999 !important;
            }
            .tg-header__area {
              position: relative !important;
              z-index: 9999 !important;
              background: transparent !important;
            }
            .tg-header__area.header-sticky {
              position: fixed !important;
              z-index: 9999 !important;
              background: transparent !important;
            }
            
            /* (TR) Hero section header'ın arkasında görünsün */
            .tg-hero-area {
              position: relative;
              z-index: 1;
              margin-top: 0;
            }
          }
          
          /* (TR) Sayfayı biraz daha uzat (altı aç) */
          main.lexor-tours-page {
            min-height: calc(100vh - 260px); /* önce -280'di */
            padding-bottom: 48px;            /* önce 32px */
          }
          @media (min-width: 1200px) {
            main.lexor-tours-page {
              min-height: calc(100vh - 270px); /* önce -300'dü */
              padding-bottom: 64px;            /* önce 40px */
            }
          }

          /* (TR) Sadece bu sayfada FooterThree üst boşluğunu kısa tut */
          .lexor-footer-tight .tg-footer-space {
            padding-top: 56px !important;
          }
          @media (min-width: 1200px) {
            .lexor-footer-tight .tg-footer-space {
              padding-top: 64px !important;
            }
          }

          /* (TR) Header/hero üstüne azıcık boşluk geri ekle */
          .tg-hero-area{
            position:relative;
            padding: 180px 0 120px; /* önce 170px */
          }
          @media(min-width:1200px){
            .tg-hero-area{ padding: 210px 0 140px; } /* önce 200px */
          }

          .lexor-hero-gap{ margin-bottom:72px !important; }
          @media(min-width:1200px){
            .lexor-hero-gap{ margin-bottom:96px !important; }
          }
          .tg-hero-bg{
            position:absolute; inset:0;
            background-size:cover; background-position:center;
          }
          .tg-hero-bg::after{
            content:""; position:absolute; inset:0;
            background:linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.35));
          }
          .tg-hero-inner{ position:relative; z-index:2; }
          .lexor-booking-card{
            background:#fff; border-radius:20px;
            box-shadow:0 20px 50px rgba(0,0,0,.10);
            padding:26px 22px;
          }
          @media(min-width:992px){ .lexor-booking-card{ padding:28px; } }
          .lexor-booking-tab{
            display:flex; align-items:center; justify-content:center;
            gap:10px; text-align:center;
            border-bottom:1px solid #eee;
            padding:10px 4px 18px; margin-bottom:18px;
          }
          .lexor-booking-tab .plane{
            width:34px;height:34px;border-radius:50%;
            display:inline-flex;align-items:center;justify-content:center;
            background:#6f2cff; color:#fff; font-size:14px;
            flex:0 0 34px;
          }
          .lexor-booking-tab .text{
            font-weight:700; color:#111; font-size:16px;
          }
        `}</style>

        {/* === HERO === */}
        <section className="tg-hero-area tg-hero-overlay p-relative lexor-hero-gap">
          <div
            className="tg-hero-bg"
            style={{
              backgroundImage: "url(/assets/img/breadcrumb/breadcrumb.jpg)",
            }}
            aria-hidden="true"
          />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <div className="tg-hero-inner">
                  <div className="lexor-booking-card">
                    <div className="lexor-booking-tab">
                      <span className="plane">
                        <i className="fa-regular fa-paper-plane" />
                      </span>
                      <span className="text">Let’s Select Destination</span>
                    </div>
                    <BannerFormTwo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === Tours list === */}
        <FeatureArea />
      </main>

      {/* FooterThree: bu sayfada üst boşluğu kısa tutuyoruz */}
      <div className="lexor-footer-tight">
        <FooterThree />
      </div>
    </Wrapper>
  );
};

export default HotelGridTwoMain;
