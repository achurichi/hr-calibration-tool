import httpStatus from 'http-status';

import motorsConfigurationsService from './service.js';
import configurationsService from '../service.js';

import { COLLECTIONS } from '../../constants/mongo.js';

const findByDescriptionAndAssembly = async (req, res) => {
  const { descriptionName, assembly } = req.query;

  try {
    const configuration = await configurationsService.findByDescriptionAndAssembly(
      descriptionName,
      assembly,
      COLLECTIONS.MOTORS_CONFIGURATION
    );
    return res.status(httpStatus.OK).send(configuration);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

const saveItem = async (req, res) => {
  const { descriptionName, assembly, motor } = req.body;

  try {
    const configuration = await configurationsService.saveItem(
      descriptionName,
      assembly,
      motor,
      COLLECTIONS.MOTORS_CONFIGURATION
    );
    return res.status(httpStatus.OK).send(configuration);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

const addItems = async (req, res) => {
  const { motorsMap } = req.body;

  try {
    await motorsConfigurationsService.addItems(motorsMap);
    return res.status(httpStatus.OK).send();
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

const deleteItem = async (req, res) => {
  const { assembly, motorId } = req.query;

  try {
    const configuration = await motorsConfigurationsService.deleteItem(assembly, motorId);
    return res.status(httpStatus.OK).send(configuration);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

export default {
  addItems,
  deleteItem,
  findByDescriptionAndAssembly,
  saveItem,
};
