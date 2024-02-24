import React from "react";

import Carousel from "components/Carousel/Crousel";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";

import styles from "./ConfigurationSection.module.scss";

const ConfigurationSection = ({ description, images, title }) => {
  return (
    <div className={styles.container}>
      {title && <div className="text-lg">{title}</div>}
      {description && <div>{description}</div>}
      {images && <Carousel images={images} />}
      <ConfigurationControls />
    </div>
  );
};

export default ConfigurationSection;
