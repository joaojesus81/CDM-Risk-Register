const { fetchAllRecords } = require("../models/records.model");

exports.getAllRecords = (req, res, next) => {
  fetchAllRecords(req).then((records) => {
    res.status(200).send({ records });
  });
};
