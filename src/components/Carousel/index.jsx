import React from "react";
import Slider from "react-slick";

import "./Carousel.scss";

const Carousel = ({ images }) => {
  return (
    <Slider
      arrows
      centerMode={false}
      infinite={false}
      swipe
      swipeToSlide
      variableWidth
    >
      {images.map((image, index) => (
        <img className="carousel-image" key={index} src={image} />
      ))}
    </Slider>
  );
};

export default Carousel;
