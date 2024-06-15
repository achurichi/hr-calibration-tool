import React from "react";
import ImageGallery from "react-image-gallery";

// not using scss modules because we want to target the nav arrows
import "./Carousel.scss";

const Carousel = ({ images }) => {
  const items = images.map((url) => ({
    original: url,
  }));

  return (
    <ImageGallery
      additionalClass="image-carousel"
      items={items}
      showIndex={images.length > 1}
      showPlayButton={false}
      showThumbnails={false}
      useBrowserFullscreen={false}
    />
  );
};

export default Carousel;
