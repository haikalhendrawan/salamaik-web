import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src="/image/ws-scenery.png" style={{borderRadius:'12px', maxHeight:'200px'}} alt='abc'/>
        </div>
        <div>
          <img src="/image/ws-scenery.png" style={{borderRadius:'12px', maxHeight:'200px'}} alt='abc'/>
        </div>
        <div>
          <img src="/image/ws-scenery.png" style={{borderRadius:'12px', maxHeight:'200px'}} alt='abc'/>
        </div>
        <div>
          <img src="/image/ws-scenery.png" style={{borderRadius:'12px', maxHeight:'200px'}} alt='abc'/>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider>
    </div>
  );
}