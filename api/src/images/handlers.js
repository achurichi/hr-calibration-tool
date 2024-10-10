import httpStatus from 'http-status';

import imageService from './service.js';

const findById = async (req, res) => {
  const { id } = req.query;

  try {
    const image = await imageService.findById(id);
    return res.status(httpStatus.OK).send(image);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.mesage);
  }
};

const save = async (req, res) => {
  const { base64 } = req.body;

  try {
    const image = await imageService.save(base64);
    return res.status(httpStatus.OK).send(image);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
  }
};

export default {
  findById,
  save,
};
