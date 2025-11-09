// src/pages/HotelGridTwoMain.tsx
import { useEffect, useState } from "react";
import Wrapper from "../layouts/Wrapper";
import SEO from "../components/SEO";
import HeaderThree from "../layouts/headers/HeaderThree";
import FooterThree from "../layouts/footers/FooterThree";
import settingsApi, { type SiteSettingsData } from "../api/settings";
import { normalizeImageUrl } from "../utils/imageUtils";

import FeatureArea from "../components/features/feature-two/FeatureArea";
import BannerFormTwo from "../components/common/banner-form/BannerFormTwo";

const HotelGridTwoMain = () => {
  const [heroImage, setHeroImage] = useState<string>('/assets/img/breadcrumb/breadcrumb.jpg');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        const imageUrl = data?.toursHeroImage || '/assets/img/breadcrumb/breadcrumb.jpg';
        setHeroImage(imageUrl);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);
  return (
    <Wrapper>
      <SEO pageTitle="Tours" />
      <HeaderThree />
      <main className="lexor-tours-page">
        <style>{`
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
            background:#fff; border-radius:24px;
            box-shadow:0 24px 60px rgba(0,0,0,.12);
            padding:32px 24px;
            position:relative;
            overflow:hidden;
          }
          @media(min-width:992px){ .lexor-booking-card{ padding:40px 32px; } }
          
          /* Gradient overlay for modern look */
          .lexor-booking-card::before{
            content:"";
            position:absolute;
            top:0; left:0; right:0;
            height:4px;
            background:linear-gradient(90deg, #7f0af5 0%, #560CE3 50%, #3498db 100%);
            border-radius:24px 24px 0 0;
          }
          
          .lexor-booking-tab{
            display:flex; align-items:center; justify-content:center;
            gap:12px; text-align:center;
            padding:0 0 24px; margin-bottom:24px;
            border-bottom:2px solid #f0f0f5;
            position:relative;
          }
          
          .lexor-booking-tab::after{
            content:"";
            position:absolute;
            bottom:-2px;
            left:50%;
            transform:translateX(-50%);
            width:60px;
            height:2px;
            background:linear-gradient(90deg, #7f0af5, #560CE3);
            border-radius:2px;
          }
          
          .lexor-booking-tab .plane{
            width:48px;height:48px;border-radius:16px;
            display:inline-flex;align-items:center;justify-content:center;
            background:linear-gradient(135deg, #7f0af5 0%, #560CE3 100%);
            color:#fff; font-size:20px;
            flex:0 0 48px;
            box-shadow:0 8px 20px rgba(127, 10, 245, 0.3);
            transition:all 0.3s ease;
          }
          
          .lexor-booking-tab:hover .plane{
            transform:translateY(-2px);
            box-shadow:0 12px 28px rgba(127, 10, 245, 0.4);
          }
          
          .lexor-booking-tab .text{
            font-weight:700; color:#2c3e50; font-size:18px;
            letter-spacing:-0.3px;
          }
          
          @media(min-width:992px){
            .lexor-booking-tab .text{ font-size:20px; }
            .lexor-booking-tab .plane{ width:52px; height:52px; font-size:22px; }
          }
        `}</style>

        {/* === HERO === */}
        <section className="tg-hero-area tg-hero-overlay p-relative lexor-hero-gap">
          <div
            className="tg-hero-bg"
            style={{
              backgroundImage: `url(${normalizeImageUrl(heroImage)})`,
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
