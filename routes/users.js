var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

/* GET users listing: Yêu cầu quyền admin */
router.get('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    next(error);
  }
});

/* GET user by ID: Không cho phép người dùng xem thông tin của chính mình */
router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    let userId = req.params.id;
    if (userId === req.user.id) {
      return CreateErrorRes(res, 403, "Không thể truy cập thông tin của chính bạn.");
    }
    let user = await userController.GetUserById(userId);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

/* POST create user: Chỉ cho phép admin */
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
});

/* PUT update user: Chỉ cho phép admin */
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await userController.UpdateUser(req.params.id, req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
