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

  publishTest() {
    const cmdVel = new ROSLIB.Topic({
      ros: this.ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist',
    });

    const twist = new ROSLIB.Message({
      linear: { x: 0.1, y: 0.2, z: 0.3 },
      angular: { x: -0.1, y: -0.2, z: -0.3 },
    });

    cmdVel.publish(twist);
  }

  // Subscribe

  subscribeTest() {
    const listener = new ROSLIB.Topic({
      ros: this.ros,
      name: '/listener',
      messageType: 'std_msgs/String',
    });

    listener.subscribe((message) => {
      console.log('Received message on ' + listener.name + ': ' + message.data);
      listener.unsubscribe();
    });
  }

  // Call services

  async serviceTest() {
    const listNodesClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/rosapi/nodes',
      serviceType: 'rosapi/Nodes',
    });

    const request = new ROSLIB.ServiceRequest({});

    return new Promise((resolve) => {
      listNodesClient.callService(request, (result) => {
        console.log(`Result for service call on ${listNodesClient.name}: ${JSON.stringify(result.nodes)}`);
        resolve(result.nodes);
      });
    });
  }

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

  async getParamTest() {
    const param = new ROSLIB.Param({
      ros: this.ros,
      name: 'test',
    });

    return new Promise((resolve) => {
      param.get((value) => {
        console.log(`${param.name}: ` + value);
        resolve(value);
      });
    });
  }

  async setParamTest() {
    const param = new ROSLIB.Param({
      ros: this.ros,
      name: 'test',
    });

    return new Promise((resolve) => {
      param.set(10, () => {
        console.log('Param set');
        resolve();
      });
    });
  }
}

export default RosStore;
