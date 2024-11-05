import { makeAutoObservable } from 'mobx';

import ROSLIB from 'roslib';

import { STATUS_TYPES } from '@/constants/status';

const ROS_URL =
  window.location.protocol === 'https:'
    ? `wss://${window.location.host}/wss`
    : `ws://${window.location.hostname}:${import.meta.env.VITE_ROS_PORT}`;

class RosStore {
  rootStore;
  ros = null;
  debug = true;
  motor_states = {
    motor_1: {
      load: 0,
      position: 2048,
      torque_enabled: false,
      errorCode: 0,
      last_updated: new Date().getTime(),
    },
  };

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  async init() {
    return new Promise((resolve) => {
      if (this.ros) {
        const message = 'ROS already initialized';
        this.log(message);
        return resolve({ status: STATUS_TYPES.ERROR, message });
      }

      try {
        this.ros = new ROSLIB.Ros({ url: ROS_URL });

        this.ros.on('connection', () => {
          // this.ros.on("error", (e) => console.log(e));
          this.log('ROS connected');
          resolve({ status: STATUS_TYPES.SUCCESS });
        });

        this.ros.on('error', (e) => {
          this.log('ROS error: ', e);
          resolve({ status: STATUS_TYPES.ERROR, message: e });
        });

        this.ros.on('close', () => {
          this.ros = null;
        });
      } catch (e) {
        this.log('Error starting ROS: ', e);
        resolve({ status: STATUS_TYPES.ERROR, message: e });
      }
    });
  }

  log(message) {
    if (this.debug) {
      console.log(message);
    }
  }

  // Publish

  // publishTest() {
  //   const cmdVel = new ROSLIB.Topic({
  //     ros: this.ros,
  //     name: '/cmd_vel',
  //     messageType: 'geometry_msgs/Twist',
  //   });

  //   const twist = new ROSLIB.Message({
  //     linear: { x: 0.1, y: 0.2, z: 0.3 },
  //     angular: { x: -0.1, y: -0.2, z: -0.3 },
  //   });

  //   cmdVel.publish(twist);
  // }

  // Subscribe

  // subscribeTest() {
  //   const listener = new ROSLIB.Topic({
  //     ros: this.ros,
  //     name: '/listener',
  //     messageType: 'std_msgs/String',
  //   });

  //   listener.subscribe((message) => {
  //     console.log('Received message on ' + listener.name + ': ' + message.data);
  //     listener.unsubscribe();
  //   });
  // }

  // Call services

  // async serviceTest() {
  //   const listNodesClient = new ROSLIB.Service({
  //     ros: this.ros,
  //     name: '/rosapi/nodes',
  //     serviceType: 'rosapi/Nodes',
  //   });

  //   const request = new ROSLIB.ServiceRequest({});

  //   return new Promise((resolve) => {
  //     listNodesClient.callService(request, (result) => {
  //       console.log(`Result for service call on ${listNodesClient.name}: ${JSON.stringify(result.nodes)}`);
  //       resolve(result.nodes);
  //     });
  //   });
  // }

  // Get and set params

  async getHead() {
    const param = new ROSLIB.Param({
      ros: this.ros,
      name: '/hr/robot_name',
    });

    return new Promise((resolve) => {
      param.get((value) => {
        console.log(`${param.name}: ` + value);
        resolve(value);
      });
    });
  }

  async getBody() {
    const param = new ROSLIB.Param({
      ros: this.ros,
      name: '/hr/robot_body',
    });

    return new Promise((resolve) => {
      param.get((value) => {
        console.log(`${param.name}: ` + value);
        resolve(value);
      });
    });
  }

  // async getParamTest() {
  //   const param = new ROSLIB.Param({
  //     ros: this.ros,
  //     name: 'test',
  //   });

  //   return new Promise((resolve) => {
  //     param.get((value) => {
  //       console.log(`${param.name}: ` + value);
  //       resolve(value);
  //     });
  //   });
  // }

  // async setParamTest() {
  //   const param = new ROSLIB.Param({
  //     ros: this.ros,
  //     name: 'test',
  //   });

  //   return new Promise((resolve) => {
  //     param.set(10, () => {
  //       console.log('Param set');
  //       resolve();
  //     });
  //   });
  // }

  /**
   * Gets the motor position for the given motor ID.
   * If the ID is not provided, returns 0.
   *
   * @param {number} id - The ID of the motor.
   * @returns {number} - The current motor position or 0 if no ID is provided.
   */
  getMotorPosition(id) {
    if (!id) {
      return 0;
    }
    // TODO: return motor position
  }

  /**
   * Sets the motor position for the given motor ID.
   *
   * @param {number} id - The ID of the motor.
   * @param {number} position - The new position to set for the motor.
   */
  setMotorPosition(id, position) {
    // TODO: set motor position
  }

  /**
   * Gets the motor load for the given motor ID.
   * If the ID is not provided, returns 0.
   *
   * @param {number} id - The ID of the motor.
   * @returns {number} - The current motor load or 0 if no ID is provided.
   */
  getMotorLoad(id) {
    if (!id) {
      return 0;
    }
    // TODO: return motor load
  }

  /**
   * Gets whether the motor torque is enabled for the given motor ID.
   *
   * @param {number} id - The ID of the motor.
   * @returns {boolean} - The current state of the motor's torque (enabled or not).
   */
  getEnableTorque(id) {
    // TODO: return motor torque state
  }

  /**
   * Sets whether the motor torque is enabled for the given motor ID.
   *
   * @param {number} id - The ID of the motor.
   * @param {boolean} enable - A flag indicating whether to enable or disable the torque.
   */
  setEnableTorque(id, enable) {
    // TODO: set motor torque state
  }

  /**
   * Gets whether the preview is enabled on the robot.
   *
   * @returns - The current state of the preview flag (enabled or not).
   */
  getPreviewOnRobot() {
    // TODO: get preview on robot
  }

  /**
   * Sets whether the preview is enabled on the robot.
   *
   * @param {boolean} previewOnRobot - A flag indicating whether to enable or disable the preview.
   */
  setPreviewOnRobot(previewOnRobot) {
    // TODO: set preview on robot
  }

  /**
   * Sets the position of a motion within an animation.
   *
   * @param {string} animationId - The ID of the animation.
   * @param {string} motionId - The ID of the motion.
   * @param {number} position - The position to set for the motion.
   */
  setMotionPosition(animationId, motionId, position) {
    // TODO: set motion position
  }
}

export default RosStore;
