import React from "react";

import Carousel from "components/Carousel";
import Slider from "components/Slider";

import "./ConfigurationSection.scss";

const ConfigurationSection = ({ description, images, title }) => {
  return (
    <div className="section-container">
      {title && <div className="text-lg">{title}</div>}
      {description && <div>{description}</div>}
      {images && <Carousel images={images} />}
      <Slider className="configuration-slider" />
    </div>
  );
};

export default ConfigurationSection;
