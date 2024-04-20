import React from "react";
import ImageGallery from "react-image-gallery";

const Carousel = ({ images }) => {
  const items = images.map((url) => ({
    original: url,
  }));

  return (
    <ImageGallery
      items={items}
      showIndex={images.length > 1}
      showPlayButton={false}
      showThumbnails={false}
      useBrowserFullscreen={false}
    />
  );
};

export default Carousel;
