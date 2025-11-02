// src/components/homes/home-three/Cta.tsx
// (Projenizde Cta bileşeni farklı bir yoldaysa aynı içeriği o dosyaya koyun.)

const Cta = () => {
  return (
    <div className="tg-cta-area tg-cta-su-wrapper tg-cta-space z-index-9 p-relative">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="tg-cta-wrap include-bg d-flex align-items-center justify-content-center"
              style={{
                backgroundImage: `url(/assets/img/cta/banner.jpg)`,
                minHeight: 260,
                textAlign: "center",
                borderRadius: 20,
              }}
            >
              <h1
                className="text-white"
                style={{
                  fontSize: "clamp(48px, 8vw, 196px)",
                  fontWeight: 900,
                  letterSpacing: "20px",
                  margin: 0,
                }}
              >
                LEXOR
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;
