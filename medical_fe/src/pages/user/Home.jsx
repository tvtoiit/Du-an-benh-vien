import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  return (
    <div className="home-root">

      {/* ======= SLIDER ======= */}
      <div className="home-slider">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src="https://benhvienbinhdinh.com.vn/benh-vien-binh-dinh-bv-moi-benh-vien-dai-hoc-y-ha-noi-hop-tac-doc-ket-qua-chup-ct-mri/"
              alt="Slide 1"
              className="slide-img"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="https://bachmai.gov.vn/_next/image?url=%2Fassets%2Fimages%2Fad3.jpg&w=3840&q=75"
              alt="Slide 2"
              className="slide-img"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="https://benhvienbinhdinh.com.vn/benh-vien-binh-dinh-bv-moi-thanh-lap-phong-kham-suc-khoe-tam-than-tu-ngay-04-3-2024/"
              alt="Slide 3"
              className="slide-img"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Page content */}
      <div className="container">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">BỆNH VIỆN BÌNH ĐỊNH</h1>
            <h2 className="hero-subtitle">KHÁM CHỮA BỆNH TOÀN DIỆN</h2>
          </div>
        </section>
      </div>

    </div>
  );
}
