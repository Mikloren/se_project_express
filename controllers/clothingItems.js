const ClothingItems = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
  BAD_REQUEST,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItems.find()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItems.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(CREATED).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteClothingItems = (req, res) => {
  const { itemId } = req.params;

  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      return item
        .deleteOne()
        .then(() => res.status(OK).send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFound") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getClothingItems, createClothingItems, deleteClothingItems };
