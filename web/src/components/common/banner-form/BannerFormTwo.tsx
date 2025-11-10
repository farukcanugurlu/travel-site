import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/** Dropdown’da göstereceğimiz sabit öneriler */
const SUGGESTIONS = [
  "Kusadasi",
  "Fethiye",
  "Bodrum",
  "Marmaris",
  "Istanbul",
  "Kemer",
  "Cappadocia",
  "Cesme",
  "Icmeler",
  "Belek",
  "Side",
  "Alanya",
  "Pamukkale",
  "Kas",
  "Kalkan",
  "Izmir",
  "Antalya",
];

export default function BannerFormTwo() {
  const navigate = useNavigate();
  const { search } = useLocation();

  // input & dropdown state
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // URL’den (destination|location) varsa sadece inputu doldur (otomatik yönlendirme YOK)
  useEffect(() => {
    const qs = new URLSearchParams(search);
    const selected = qs.get("destination") || qs.get("location");
    if (selected) setLocation(selected);
  }, [search]);

  // dışarı tıklayınca dropdown kapansın
  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && !wrapRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  // seçimi yaptıktan sonra direkt tours’a götür
  const go = (dest: string) => {
    const d = dest.trim();
    if (!d) return;
    const qs = new URLSearchParams();
    qs.set("destination", d);
    setOpen(false);
    navigate(`/tours?${qs.toString()}`);
  };

  // Enter’a basılırsa da git (buton yok)
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      go(location);
    }
  };

  // ---- inline küçük stiller
  const LABEL: CSSProperties = {
    display: "block",
    marginBottom: 8,
    lineHeight: 1.1,
    fontSize: 14,
    fontWeight: 600,
  };
  const WRAP: CSSProperties = {
    position: "relative",
    height: 44,
    padding: 0,
    display: "block",
  };
  const INPUT: CSSProperties = {
    height: "100%",
    width: "100%",
    paddingRight: 40,
    border: "none",
    background: "transparent",
  };
  const ICON_RIGHT: CSSProperties = {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    display: "inline-flex",
    alignItems: "center",
  };
  const stop = (e: ReactMouseEvent) => e.stopPropagation();

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <style>{`
        /* Üst container'lar - dropdown'un dışarı taşmasına izin ver */
        .tg-booking-form-wrap,
        .tg-booking-form-item,
        .tab-content,
        .tab-pane {
          overflow: visible !important;
        }
        
        .lexor-form .tg-booking-add-input-field,
        .lexor-form .tg-booking-add-input-date { 
          background: #fff; 
          border-radius: 12px; 
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }
        .lexor-form .tg-booking-add-input-date:focus-within {
          border-color: #560CE3;
          box-shadow: 0 0 0 4px rgba(86, 12, 227, 0.1);
        }
        .tg-booking-title-value{ color:#6b6b6b; font-size:14px; }

        /* Parent container - dropdown'un dışarı taşmasına izin ver */
        .lexor-form .tg-booking-form-parent {
          position: relative !important;
          overflow: visible !important;
          z-index: 1 !important;
        }
        .lexor-form .tg-booking-form-parent-inner.tg-hero-location {
          position: relative !important;
          overflow: visible !important;
          z-index: 1 !important;
        }
        .lexor-form .tg-booking-add-input-date {
          position: relative !important;
          overflow: visible !important;
        }
        .lexor-form .tg-booking-form-parent-inner {
          overflow: visible !important;
        }

        /* dropdown */
        .lexor-loc-dropdown{
          border: 2px solid #e9ecef !important;
          border-radius: 12px !important; 
          background: #fff !important;
          box-shadow: 0 12px 32px rgba(0,0,0,.12) !important;
          margin-top: 8px !important;
          position: absolute !important;
          top: calc(100% + 8px) !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 10000 !important;
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          transform: none !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding: 0 !important;
          min-width: 0 !important;
          max-height: none !important;
        }
        .lexor-loc-dropdown * { 
          position: static !important; 
          float: none !important; 
          box-sizing: border-box; 
        }
        .lexor-loc-list{ 
          max-height: 300px; 
          overflow-y: auto; 
          padding: 8px 0; 
          display: block !important; 
        }
        .lexor-loc-item{
          width: 100%; 
          background: transparent; 
          border: 0; 
          outline: 0;
          display: flex !important; 
          align-items: center; 
          justify-content: space-between;
          padding: 14px 18px; 
          gap: 12px; 
          cursor: pointer; 
          min-height: 48px; 
          line-height: 1.4; 
          font-size: 15px; 
          text-align: left;
          transition: background 0.2s ease;
        }
        .lexor-loc-item + .lexor-loc-item{ border-top: 1px solid #f1f1f4; }
        .lexor-loc-item:hover{ background: #f8f9fa; }
        .lexor-loc-item:active{ background: #e9ecef; }
        .lexor-loc-item .label{ 
          flex: 1; 
          text-align: left; 
          display: block; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
          font-weight: 500;
          color: #2c3e50;
        }
        .lexor-loc-item .icon{ 
          width: 18px; 
          height: 18px; 
          opacity: 0.6; 
          display: inline-flex;
          color: #560CE3;
        }
        
        .tg-booking-form-title {
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 12px;
          font-size: 15px;
          letter-spacing: -0.2px;
        }
        
        .input {
          font-size: 16px;
          color: #2c3e50;
          font-weight: 500;
        }
        .input::placeholder {
          color: #adb5bd;
          font-weight: 400;
        }
        
        .tg-booking-add-input-date {
          transition: all 0.3s ease;
        }
        
        .tg-booking-add-input-date:focus-within {
          border-color: #7f0af5 !important;
          box-shadow: 0 0 0 4px rgba(127, 10, 245, 0.1) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="tg-booking-form lexor-form">
        <div
          className="tg-booking-form-parent"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            alignItems: "start",
            columnGap: 16,
            rowGap: 12,
            position: "relative",
            overflow: "visible",
            zIndex: 1,
          }}
        >
          {/* Location (tek alan) */}
          <div
            className="tg-booking-form-parent-inner tg-hero-location p-relative"
            ref={wrapRef}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <span className="tg-booking-form-title" style={LABEL}>
              Search Destination
            </span>

            <div
              className="tg-booking-add-input-date p-relative"
              style={WRAP}
              onClick={(e) => {
                // Input'a tıklanmışsa hiçbir şey yapma (input kendi onClick'ini handle ediyor)
                if ((e.target as HTMLElement).tagName === 'INPUT') {
                  return;
                }
                // Input dışına (icon veya boş alana) tıklanmışsa toggle yap
                setOpen((p) => !p);
              }}
            >
              <input
                className="input"
                style={INPUT}
                type="text"
                placeholder="Where do you want to go?"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setOpen(true);
                }}
                onKeyDown={onKeyDown}
                onFocus={() => setOpen(true)}
                onClick={(e) => {
                  // Input'a tıklayınca sadece aç, parent'ın onClick'ini tetikleme
                  e.stopPropagation();
                  if (!open) {
                    setOpen(true);
                  }
                }}
              />
              <span style={ICON_RIGHT} aria-hidden="true" title="Location">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: '#560CE3' }}
                >
                  <path
                    d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>
            </div>

            {/* Öneri listesi - parent container'ın dışına taşındı */}
            {open && (
              <div
                className="lexor-loc-dropdown"
                onClick={stop}
              >
                  <div className="lexor-loc-list">
                    {SUGGESTIONS.filter(s => 
                      !location || s.toLowerCase().includes(location.toLowerCase())
                    ).map((s) => (
                      <button
                        type="button"
                        key={s}
                        className="lexor-loc-item"
                        onMouseDown={() => go(s)}
                      >
                        <span className="label">{s}</span>
                        <span className="icon" aria-hidden="true">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="10"
                              r="2.5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </span>
                      </button>
                    ))}
                    {SUGGESTIONS.filter(s => 
                      !location || s.toLowerCase().includes(location.toLowerCase())
                    ).length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#6b6b6b' }}>
                        No destinations found
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </form>
  );
}
