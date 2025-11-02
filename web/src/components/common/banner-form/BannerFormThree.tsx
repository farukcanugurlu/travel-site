import { type ReactNode } from "react";
import BannerFormTwo from "./BannerFormTwo";

interface TabData {
  title: string;
  icon: ReactNode;
}

const tab_title: TabData[] = [
  {
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.5 2.5L8.8 10.2M16.5 2.5L11.6 16.5L8.8 10.2M16.5 2.5L2.5 7.4L8.8 10.2"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Find Your Dream Tour",
  },
];

const BannerFormThree = () => {
  return (
    <div
      className="tg-booking-form-area tg-booking-form-space"
      style={{ paddingBottom: 48 }} // dıştaki beyaz alanı biraz daralttık
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Kartı daraltıp ortaladık */}
            <div
              className="tg-booking-form-wrap"
              style={{
                maxWidth: 980, // daha dar kart
                margin: "0 auto",
                padding: "18px 22px", // iç padding azaltıldı
              }}
            >
              {/* Sekmeler (tek sekme) */}
              <div className="tg-booking-form-tabs">
                <div
                  className="nav nav-tab justify-content-center"
                  id="nav-tab"
                  role="tablist"
                >
                  {tab_title.map((tab, index) => (
                    <button
                      key={index}
                      className="nav-link active"
                      id="nav-platform-tab"
                      type="button"
                    >
                      <span className="borders"></span>
                      <span className="icon">{tab.icon}</span>
                      <span>{tab.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-platform">
                  <div className="tg-booking-form-item">
                    <BannerFormTwo />
                  </div>
                </div>
              </div>
              {/* /Form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerFormThree;
