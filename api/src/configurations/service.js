import mongoDBClient from '../mongo/mongoDBClient.js';
import { logErrorAndThrow } from '../utils/logging.js';
import descriptionsService from '../descriptions/service.js';

import { COLLECTIONS } from '../constants/mongo.js';

/**
 * Creates multiple configuration entries for motors and animations based on the provided items.
 *
 * @param {Object} items - The items containing configurations to create, where the keys are assembly names and values are description names.
 * @throws Will throw an error if any assemblies are repeated or if an error occurs during database operations.
 */
const createMany = async function (items) {
  // check that assemblies are not repeated
  const assemblies = Object.keys(items);
  if (new Set(assemblies).size !== assemblies.length) {
    throw new Error('Some assemblies are repeated in the provided object');
  }

  const motorsConfigCollection = await mongoDBClient.getCollection(COLLECTIONS.MOTORS_CONFIGURATION);
  const animationsConfigCollection = await mongoDBClient.getCollection(COLLECTIONS.ANIMATIONS_CONFIGURATION);
  let motorsConfigAssemblies;
  let animationsConfigAssemblies;

  try {
    motorsConfigAssemblies = (await motorsConfigCollection.find({}).toArray()).map(({ assembly }) => assembly);
    animationsConfigAssemblies = (await animationsConfigCollection.find({}).toArray()).map(({ assembly }) => assembly);
  } catch (err) {
    logErrorAndThrow(err.stack, 'Error occurred while getting configurations');
  }

  const existingAssemblies = [];

  assemblies.forEach((assembly) => {
    if (motorsConfigAssemblies.includes(assembly) || animationsConfigAssemblies.includes(assembly)) {
      existingAssemblies.push(assembly);
    }
  });

  if (existingAssemblies.length) {
    const repeated = existingAssemblies.join(', ');
    throw new Error(`The following assemblies already have a configuration: ${repeated}`);
  }

  // build configurations with default values
  const newConfigs = await generateManyDefaultConfigurations(items);

  // save new configurations
  try {
    await motorsConfigCollection.insertMany(newConfigs.motors);
    await animationsConfigCollection.insertMany(newConfigs.animations);
  } catch (err) {
    logErrorAndThrow(err.stack, 'Error occurred while creating configurations');
  }
};

/**
 * Generates default motor and animation configurations for the provided items.
 *
 * @param {Object} items - The items for which to generate configurations, where the keys are assembly names and values are description names.
 * @returns {Promise<Object>} An object containing the generated motor and animation configurations.
 * @throws Will throw an error if there is an issue generating configurations.
 */
const generateManyDefaultConfigurations = async function (items) {
  const configs = { motors: [], animations: [] };

  // generate a default configuration pair (motors, animations) for each item
  const promises = Object.entries(items).map(generateDefaultConfiguration);
  const results = await Promise.allSettled(promises);
  if (results.some((result) => result.status === 'rejected')) {
    throw new Error('Error occurred while generating default configurations');
  }

  results.forEach(({ value }) => {
    configs.motors.push(value.motorsConfig);
    configs.animations.push(value.animationsConfig);
  });

  return configs;
};

/**
 * Generates a default configuration for a specific assembly and description.
 *
 * @param {Array} param - An array containing the assembly name and description name.
 * @returns {Promise<Object>} An object containing motor and animation configurations.
 * @throws Will throw an error if there is an issue retrieving descriptions.
 */
const generateDefaultConfiguration = async function ([assembly, descriptionName]) {
  const motorsDescription = await descriptionsService.findByName(descriptionName, COLLECTIONS.MOTORS_DESCRIPTION);
  const animationsDescription = await descriptionsService.findByName(
    descriptionName,
    COLLECTIONS.ANIMATIONS_DESCRIPTION
  );

  const motors = [];
  motorsDescription.motors?.forEach((m) => {
    if (m.defaultShow) {
      motors.push({
        descId: m.id,
        motorName: m.name,
        group: m.group,
        neutralPositionValue: m.neutralPosition.defaultValue,
        maxPositionValue: m.maxPosition.defaultValue,
        minPositionValue: m.minPosition.defaultValue,
        sort_no: m.sort_no,
        motor_id: m.motor_id,
        hardware: m.hardware,
        transmission: m.transmission,
        speed: m.speed,
        acceleration: m.acceleration,
        torque: m.torque,
        topic: m.topic,
        mapping: m.mapping,
      });
    }
  });

  const animations = [];
  animationsDescription.animations?.forEach((a) => {
    const motions =
      a.motions?.map((m) => ({
        descId: m.id,
        motionName: m.name,
        value: m.defaultValue,
      })) || [];
    animations.push({
      descId: a.id,
      animationName: a.name,
      animationType: a.type,
      motions,
    });
  });

  return {
    motorsConfig: {
      descriptionName,
      assembly,
      motors,
    },
    animationsConfig: {
      descriptionName,
      assembly,
      animations,
    },
  };
};

/**
 * Finds a document in the specified collection by description name and assembly.
 *
 * @param {string} descriptionName - The name of the description to search for.
 * @param {string} assembly - The assembly to search for.
 * @param {string} collectionName - The name of the collection to search in.
 * @returns {Promise<Object|null>} The found document, or null if no document matches the criteria.
 * @throws Will throw an error if there is an issue with the database query.
 */
const findByDescriptionAndAssembly = async function (descriptionName, assembly, collectionName) {
  const collection = await mongoDBClient.getCollection(collectionName);

  try {
    return await collection.findOne({ descriptionName, assembly });
  } catch (err) {
    logErrorAndThrow(
      err.stack,
      `Could not get configuration with descriptionName ${descriptionName} and assembly ${assembly}`
    );
  }
};

/**
 * Saves an item to the specified configuration collection.
 *
 * @param {string} descriptionName - The description name of the configuration.
 * @param {string} assembly - The assembly identifier of the configuration.
 * @param {Object} item - The item to be saved in the configuration.
 * @param {string} collectionName - The name of the collection where the configuration is stored.
 * @returns {Promise<Object>} - The updated configuration object.
 * @throws Will throw an error if there is an issue retrieving or saving the configuration.
 */
const saveItem = async function (descriptionName, assembly, item, collectionName) {
  const collection = await mongoDBClient.getCollection(collectionName);
  let configuration;

  try {
    configuration = await collection.findOne({ descriptionName, assembly });
  } catch (err) {
    logErrorAndThrow(
      err.stack,
      `Could not get configuration with descriptionName ${descriptionName} and assembly ${assembly}`
    );
  }

  const listProp = collectionName === COLLECTIONS.MOTORS_CONFIGURATION ? 'motors' : 'animations';

  // If the configuration object doesn't exist create a new one
  if (!configuration) {
    configuration = {
      descriptionName,
      assembly,
      [listProp]: [],
    };
  }

  let items = configuration[listProp] || [];

  // Update configuration items list
  const index = items.findIndex((i) => i.descId === item.descId);
  if (index === -1) {
    items.push(item);
  } else {
    items[index] = item;
  }

  // Save updated configuration
  try {
    await collection.updateOne(
      { descriptionName, assembly },
      { $set: { ...configuration, [listProp]: items } },
      { upsert: true }
    );
  } catch (err) {
    logErrorAndThrow(err.stack, `Error occurred while saving configuration`);
  }

  // Get updated configuration
  try {
    return await collection.findOne({ descriptionName, assembly });
  } catch (err) {
    logErrorAndThrow(err.stack, `Error occurred while retrieving configuration`);
  }
};

export default {
  createMany,
  findByDescriptionAndAssembly,
  saveItem,
};
