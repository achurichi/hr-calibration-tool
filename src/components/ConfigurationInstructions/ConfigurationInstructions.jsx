import React, { useEffect } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import Carousel from "components/Carousel/Carousel";
import Spinner from "components/Spinner/Spinner";

import rootStore from "stores/root.store";

// not using modules because we want to target the fullscreen carousel class
import "./ConfigurationInstructions.scss";

const ConfigurationInstructions = observer(
  ({ className, description, images, onScreenChange, title }) => {
    const { descriptionStore } = rootStore;

    useEffect(() => {
      images.forEach((id) => {
        descriptionStore.fetchImageIfNotPresent(id);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    // use referenceImages map directly to trigger re-render when the image is loaded
    const imagesBase64 = images
      .map((id) => descriptionStore.referenceImages.get(id)?.base64)
      .filter((i) => i);

    const showCarousel = !!images.length;
    const loadingImages = images.length !== imagesBase64.length;

    return (
      <div
        className={classNames(
          "configuration-instructions-container",
          className,
        )}
      >
        {title && <div className="fw-bold">{title}</div>}
        <div className="content">
          <div className="description">{description}</div>
          {showCarousel && (
            <div className="images">
              {loadingImages && <Spinner />}
              {!loadingImages && (
                <Carousel
                  images={imagesBase64}
                  onScreenChange={onScreenChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default ConfigurationInstructions;
