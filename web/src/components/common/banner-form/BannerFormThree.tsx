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
      style={{ paddingBottom: 48 }}
    >
      <style>{`
        .tg-booking-form-wrap {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(0,0,0,.12);
          position: relative;
          overflow: hidden;
        }
        
        /* Gradient overlay for modern look */
        .tg-booking-form-wrap::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #7f0af5 0%, #560CE3 50%, #3498db 100%);
          border-radius: 24px 24px 0 0;
        }
        
         .tg-booking-form-tabs {
           margin-bottom: 16px;
           padding-bottom: 16px;
           border-bottom: 2px solid #f0f0f5;
           position: relative;
         }
        
        .tg-booking-form-tabs::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #7f0af5, #560CE3);
          border-radius: 2px;
        }
        
         .tg-booking-form-tabs .nav-link {
           background: transparent;
           border: none;
           padding: 12px 20px;
           border-radius: 16px;
           display: inline-flex;
           align-items: center;
           gap: 10px;
           font-weight: 700;
           font-size: 17px;
           color: #2c3e50;
           letter-spacing: -0.3px;
           transition: all 0.3s ease;
           position: relative;
         }
        
        .tg-booking-form-tabs .nav-link:hover {
          background: #f8f9ff;
          transform: translateY(-2px);
        }
        
         .tg-booking-form-tabs .nav-link .icon {
           width: 42px;
           height: 42px;
           border-radius: 14px;
           display: inline-flex;
           align-items: center;
           justify-content: center;
           background: linear-gradient(135deg, #7f0af5 0%, #560CE3 100%);
           color: #fff;
           box-shadow: 0 8px 20px rgba(127, 10, 245, 0.3);
           transition: all 0.3s ease;
         }
        
        .tg-booking-form-tabs .nav-link:hover .icon {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(127, 10, 245, 0.4);
        }
        
        .tg-booking-form-tabs .nav-link .borders {
          display: none;
        }
        
         @media (min-width: 992px) {
           .tg-booking-form-tabs .nav-link {
             font-size: 19px;
             padding: 14px 24px;
           }
           .tg-booking-form-tabs .nav-link .icon {
             width: 46px;
             height: 46px;
           }
         }
      `}</style>
      
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Kartı daraltıp ortaladık */}
               <div
                 className="tg-booking-form-wrap"
                 style={{
                   maxWidth: 980,
                   margin: "0 auto",
                   padding: "24px 20px",
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
