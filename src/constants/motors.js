export const GROUPS = {
  RIGHT_ARM: "RightArm",
  RIGHT_HAND: "RightHand",
  LEFT_ARM: "LeftArm",
  LEFT_HAND: "LeftHand",
};

export const MOTORS = [
  { id: 1, name: "RightShoulderPitch", group: GROUPS.RIGHT_ARM },
  { id: 2, name: "RightShoulderRoll", group: GROUPS.RIGHT_ARM },
  { id: 3, name: "RightShoulderYaw", group: GROUPS.RIGHT_ARM },
  { id: 4, name: "RightElbowPitch", group: GROUPS.RIGHT_ARM },
  { id: 5, name: "RightElbowYaw", group: GROUPS.RIGHT_ARM },
  { id: 6, name: "RightWristPitch", group: GROUPS.RIGHT_HAND },
  { id: 7, name: "RightWristRoll", group: GROUPS.RIGHT_HAND },
  { id: 8, name: "RightThumbRoll", group: GROUPS.RIGHT_HAND },
  { id: 9, name: "RightThumbFinger", group: GROUPS.RIGHT_HAND },
  { id: 10, name: "RightIndexFinger", group: GROUPS.RIGHT_HAND },
  { id: 11, name: "RightMiddleFinger", group: GROUPS.RIGHT_HAND },
  { id: 12, name: "RightRingFinger", group: GROUPS.RIGHT_HAND },
  { id: 13, name: "RightPinkyFinger", group: GROUPS.RIGHT_HAND },
  { id: 14, name: "LeftShoulderPitch", group: GROUPS.LEFT_ARM },
  { id: 15, name: "LeftShoulderRoll", group: GROUPS.LEFT_ARM },
  { id: 16, name: "LeftShoulderYaw", group: GROUPS.LEFT_ARM },
];
