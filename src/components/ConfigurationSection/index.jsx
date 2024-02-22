import React from "react";

import Carousel from "components/Carousel";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";

import "./ConfigurationSection.scss";

const ConfigurationSection = ({ description, images, title }) => {
  return (
    <div className="section-container">
      {title && <div className="text-lg">{title}</div>}
      {description && <div>{description}</div>}
      {images && <Carousel images={images} />}
      <ConfigurationControls />
    </div>
  );
};

export default ConfigurationSection;
