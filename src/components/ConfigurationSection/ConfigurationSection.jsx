import React from "react";
import classNames from "classnames";

import Carousel from "components/Carousel/Carousel";

import styles from "./ConfigurationSection.module.scss";

const ConfigurationSection = ({
  children,
  className,
  description,
  images,
  title,
}) => {
  return (
    <>
      <div className={classNames(styles.container, className)}>
        {title && <div className="text-lg">{title}</div>}
        <div className={styles.content}>
          {description && <div>{description}</div>}
          {images && <Carousel images={images} />}
        </div>
      </div>
      {children}
    </>
  );
};

export default ConfigurationSection;
