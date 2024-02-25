import React from "react";
import classNames from "classnames";

import Carousel from "components/Carousel/Crousel";

import styles from "./ConfigurationSection.module.scss";

const ConfigurationSection = ({
  children,
  className,
  description,
  images,
  title,
}) => {
  return (
    <div>
      <div className={classNames(styles.container, className)}>
        {title && <div className="text-lg">{title}</div>}
        {description && <div>{description}</div>}
        {images && <Carousel images={images} />}
      </div>
      {children}
    </div>
  );
};

export default ConfigurationSection;
