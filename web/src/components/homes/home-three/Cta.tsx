// src/components/homes/home-three/Cta.tsx
import { Link } from "react-router-dom";
import Button from "../../common/Button";

const Cta = () => {
  return (
    <>
      <style>{`
        /* Left image: only left corners rounded */
        .tg-banner-video-wrap{
          min-height: 180px;
          background-size: cover;
          background-position: center;
          border-radius: 12px 0 0 12px;
          overflow: hidden;
        }
        /* Right panel: only right corners rounded (override theme if needed) */
        .tg-banner-content{
          border-radius: 0 12px 12px 0;
        }
        /* Mobile: stack → round top/bottom correctly */
        @media (max-width: 991.98px){
          .tg-banner-video-wrap{ border-radius: 12px 12px 0 0; }
          .tg-banner-content{ border-radius: 0 0 12px 12px; }
        }
      `}</style>

      <div className="tg-banner-area tg-banner-space">
        <div className="container">
          <div className="row gx-0 align-items-stretch">
            {/* LEFT: image only (no play button, no link) */}
            <div className="col-lg-7">
              <div
                className="tg-banner-video-wrap include-bg h-100"
                style={{ backgroundImage: `url(/assets/img/banner/thumb.jpg)` }}
              />
            </div>

            {/* RIGHT: unchanged */}
            <div className="col-lg-5">
              <div className="tg-banner-content p-relative z-index-1 text-center h-100">
                <img
                  className="tg-banner-shape"
                  src="/assets/img/banner/shape.png"
                  alt="shape"
                />
                <h4 className="tg-banner-subtitle mb-10">
                  Enjoy Your Dream Tour
                </h4>
                <h2 className="tg-banner-title mb-25">With Lexor</h2>
                <div className="tg-banner-btn">
                  <Link to="/tours" className="tg-btn tg-btn-switch-animation">
                    <Button text="Take a Tour" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="tg-banner-transparent-bg" />
    </>
  );
};

export default Cta;
