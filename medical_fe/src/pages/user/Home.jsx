import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpg";
import gioithieu from "../../assets/gioithieu.jpg";
import dichvudatbiet from "../../assets/dichvudatbiet.jpg";
import chuyenkhoa from "../../assets/chuyenkhoa.jpg";
import chuyengiabacsi from "../../assets/chuyengiabacsi.jpg";
import tiennghi from "../../assets/tiennghi.jpg";


export default function Home() {
  return (
    <div className="home-root">

      {/* ======= SLIDER ======= */}
      <div className="home-slider">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src={slide1}
              alt="Slide 1"
              className="slide-img"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={slide2}
              alt="Slide 2"
              className="slide-img"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={slide3}
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

        <div className="hero-section" id="gioithieu">
          <div className="section-card">
            <img src={gioithieu} alt="Giới thiệu" />
          </div>
        </div>

        <div className="hero-section" id="chuyenkhoa">
          <div className="section-card">
            <img src={chuyenkhoa} alt="Chuyên khoa" />
          </div>
        </div>

        <div className="hero-section" id="chuyengia">
          <div className="section-card">
            <img src={chuyengiabacsi} alt="Chuyên gia" />
          </div>
        </div>

        <div className="hero-section" id="dichvu">
          <div className="section-card">
            <img src={dichvudatbiet} alt="Dịch vụ đặc biệt" />
          </div>
        </div>

        <div className="hero-section" id="tiennghi">
          <div className="section-card">
            <img src={tiennghi} alt="Tiện nghi" />
          </div>
        </div>
      </div>
    </div>
  );
}
