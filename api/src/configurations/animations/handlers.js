import httpStatus from 'http-status';

import configurationsService from '../service.js';

import { COLLECTIONS } from '../../constants/mongo.js';

const findByDescriptionAndAssembly = async (req, res) => {
  const { descriptionName, assembly } = req.query;

  try {
    const configuration = await configurationsService.findByDescriptionAndAssembly(
      descriptionName,
      assembly,
      COLLECTIONS.ANIMATIONS_CONFIGURATION
    );
    return res.status(httpStatus.OK).send(configuration);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

const saveItem = async (req, res) => {
  const { descriptionName, assembly, animation } = req.body;

  try {
    const configuration = await configurationsService.saveItem(
      descriptionName,
      assembly,
      animation,
      COLLECTIONS.ANIMATIONS_CONFIGURATION
    );
    return res.status(httpStatus.OK).send(configuration);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

export default {
  findByDescriptionAndAssembly,
  saveItem,
};
