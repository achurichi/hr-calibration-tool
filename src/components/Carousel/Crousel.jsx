import React from "react";
import Slider from "react-slick";

import styles from "./Carousel.module.scss";

const Carousel = ({ images }) => {
  if (images.length === 1) {
    return <img className={styles.image} src={images[0]} />;
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
        <img className={styles.image} key={index} src={image} />
      ))}
    </Slider>
  );
};

export default Carousel;
