import React, { useState } from "react";

import Select from "react-select";

import { MOTORS } from "constants/motors";

import ConfigurationSection from "components/ConfigurationSection";

import "./MotorConfiguration.scss";

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

const SAMPLE_IMAGES = [
  "https://picsum.photos/600",
  "https://picsum.photos/600",
  "https://picsum.photos/600",
  "https://picsum.photos/600",
  "https://picsum.photos/600",
];

const MOTOR_OPTIONS = MOTORS.map((motor) => ({
  label: motor.name,
  value: motor.name,
}));

const MotorConfiguration = () => {
  const [selectedMotor, setSelectedMotor] = useState(MOTOR_OPTIONS[0]);

  return (
    <div className="motor-config-container">
      <Select
        className="motor-select"
        onChange={setSelectedMotor}
        options={MOTOR_OPTIONS}
        value={selectedMotor}
      />
      <ConfigurationSection
        description={LOREM_IPSUM}
        images={SAMPLE_IMAGES}
        title="Neutral position"
      />
    </div>
  );
};

export default MotorConfiguration;
