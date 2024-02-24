import React from "react";
import Slider from "react-slick";

import "./Carousel.scss";

const Carousel = ({ images }) => {
  if (images.length === 1) {
    return <img className="carousel-image" src={images[0]} />;
  }

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
