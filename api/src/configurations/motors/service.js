import mongoDBClient from '../../mongo/mongoDBClient.js';
import { logErrorAndThrow } from '../../utils/logging.js';

import { COLLECTIONS } from '../../constants/mongo.js';

/**
 * Finds a document in the specified collection by description name and assembly.
 *
 * @param {string} descriptionName - The name of the description to search for.
 * @param {string} assembly - The assembly to search for.
 * @param {string} collectionName - The name of the collection to search in.
 * @returns {Promise<Object|null>} The found document, or null if no document matches the criteria.
 * @throws Will throw an error if there is an issue with the database query.
 */
const addItems = async function (motorsMap) {
  const configCollection = await mongoDBClient.getCollection(COLLECTIONS.MOTORS_CONFIGURATION);
  const descCollection = await mongoDBClient.getCollection(COLLECTIONS.MOTORS_DESCRIPTION);

  for (const assembly in motorsMap) {
    let description;
    let configuration;
    const motorIds = motorsMap[assembly];

    // find description and configuration
    try {
      configuration = await configCollection.findOne({ assembly });
      description = await descCollection.findOne({
        name: configuration.descriptionName,
      });
    } catch (err) {
      logErrorAndThrow(err.stack, 'Error occurred while getting description and configurations');
    }

    const descMotorIds = description.motors?.map((m) => m.id) || [];
    if (motorIds.some((id) => !descMotorIds.includes(id))) {
      throw new Error('Motor not found');
    }

    const configMotorIds = configuration.motors?.map((m) => m.descId) || [];
    if (motorIds.some((id) => configMotorIds.includes(id))) {
      throw new Error('Motor already added');
    }

    let motors = configuration.motors || [];
    motorIds.forEach((id) => {
      const motor = description.motors?.find((m) => m.id === id);

      if (!motor) {
        return;
      }

      const motorProps = {
        descId: motor.id,
        motorName: motor.name,
        group: motor.group,
        neutralPositionValue: motor.neutralPosition.defaultValue,
        maxPositionValue: motor.maxPosition.defaultValue,
        minPositionValue: motor.minPosition.defaultValue,
      };

      const advancedProps = [
        'sort_no',
        'motor_id',
        'hardware',
        'transmission',
        'speed',
        'acceleration',
        'torque',
        'topic',
        'mapping',
      ];
      advancedProps.forEach((prop) => {
        if (Object.hasOwn(motor, prop)) {
          motorProps[prop] = motor[prop];
        }
      });

      motors.push(motorProps);
    });

    // save updated configuration
    try {
      await configCollection.updateOne({ assembly }, { $set: { ...configuration, motors } });
    } catch (err) {
      logErrorAndThrow(err.stack, 'Error occurred while updating motors configuration');
    }
  }
};

const deleteItem = async function (assembly, motorId) {
  const collection = await mongoDBClient.getCollection(COLLECTIONS.MOTORS_CONFIGURATION);

  let configuration;

  // find configuration
  try {
    configuration = await collection.findOne({ assembly });
  } catch (err) {
    logErrorAndThrow(err.stack, 'Error occurred while getting configuration');
  }

  let motors = configuration.motors || [];

  // update motors list
  const index = motors.findIndex((m) => m.descId === motorId);
  if (index === -1) {
    throw new Error('Motor does not exist');
  } else {
    motors.splice(index, 1);
  }

  // save updated configuration
  try {
    await collection.updateOne({ assembly }, { $set: { ...configuration, motors } });
  } catch (err) {
    logErrorAndThrow(err.stack, 'Error occurred while updating motor configuration');
  }

  // get updated configuration
  try {
    return await collection.findOne({ assembly });
  } catch (err) {
    logErrorAndThrow(err.stack, 'Error occurred while getting motor configuration');
  }
};

export default {
  addItems,
  deleteItem,
};
