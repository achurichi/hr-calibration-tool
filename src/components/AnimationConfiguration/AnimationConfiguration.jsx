import React, { useEffect, useState } from "react";

import Select from "react-select";

import { GROUPS, MOTORS } from "constants/motors";

import ConfigurationSection from "components/ConfigurationSection/ConfigurationSection";
import Footer from "components/AnimationConfiguration/Footer";
import Slider from "components/AnimationConfiguration/Slider";

import styles from "./AnimationConfiguration.module.scss";

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

const SAMPLE_IMAGES = [
  "https://placehold.co/600?text=Reference+image\\n600+x+600",
  "https://placehold.co/600?text=Reference+image\\n600+x+600",
  "https://placehold.co/600?text=Reference+image\\n600+x+600",
  "https://placehold.co/600?text=Reference+image\\n600+x+600",
];

const GROUPS_OPTIONS = Object.values(GROUPS).map((group) => ({
  label: group,
  value: group,
}));

const MOTORS_NAMES = MOTORS.map((motor) => motor.name);

const AnimationConfiguration = ({ animations }) => {
  const [selectedViseme, setSelectedViseme] = useState(null);

  const animationOptions = animations.map((animation) => ({
    label: animation.name,
    value: animation.name,
  }));

  useEffect(() => {
    if (animations) {
      setSelectedViseme({
        label: animations[0].name,
        value: animations[0].name,
      });
    }
  }, [animations]);

  return (
    <div className={styles.container}>
      <div className={styles["config-container"]}>
        <div className={styles["config-internal-container"]}>
          <div className={styles["select-container"]}>
            <Select
              onChange={setSelectedViseme}
              options={animationOptions}
              value={selectedViseme}
            />
          </div>
          <div className={styles.configs}>
            <ConfigurationSection
              className={styles.sticky}
              description={LOREM_IPSUM}
              images={SAMPLE_IMAGES}
            >
              <Select
                className={styles["group-select"]}
                isClearable
                options={GROUPS_OPTIONS}
                placeholder="Group"
              />
              <div className={styles.controls}>
                {MOTORS_NAMES.map((name) => (
                  <Slider key={name} name={name} />
                ))}
              </div>
            </ConfigurationSection>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnimationConfiguration;
