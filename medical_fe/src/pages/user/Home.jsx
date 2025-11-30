import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import img1 from "../../assets/ad1.webp";
import logo from "../../assets/logo.jpg";


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
              src="../../../assets/ad1.jpg"
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
              src={img1}
              alt="Slide 3"
              className="slide-img"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Page content */}
      <div className="container">
        <section className="hero-section" id="gioithieu">
          <div className="hero-content">
            <h1 className="hero-title">BỆNH VIỆN BÌNH ĐỊNH</h1>
            <h2 className="hero-subtitle">KHÁM CHỮA BỆNH TOÀN DIỆN</h2>
          </div>
        </section>
      </div>

      <div className="logo" id="tiennghi">
        <img
          width="200"
          src={logo}
          alt="Logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </div>

      {/* Bỏ ảnh dô */}

    </div>
  );
}
