import ImageGallery from 'react-image-gallery';

// not using modules because we want to be able to target the nav arrows and image-carousel classes
import './Carousel.scss';

const Carousel = ({ images, onScreenChange }) => {
  const items = images.map((url) => ({ original: url }));

  return (
    <ImageGallery
      additionalClass="image-carousel"
      items={items}
      onScreenChange={onScreenChange}
      showIndex={images.length > 1}
      showPlayButton={false}
      showThumbnails={false}
      useBrowserFullscreen={false}
    />
  );
};

export default Carousel;
