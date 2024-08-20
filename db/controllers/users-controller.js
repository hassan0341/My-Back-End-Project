const { fetchUsers, fetchSingleUser } = require("../models/users-model");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchSingleUser(username).then((user) => {
    res.status(200).send({ user });
  });
};
