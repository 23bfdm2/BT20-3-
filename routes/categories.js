var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
const checkRole = require('../middlewares/checkRole');  // Middleware kiểm tra quyền

/* GET all categories: Không yêu cầu đăng nhập */
router.get('/', async function (req, res, next) {
  try {
    let categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

/* GET category by ID: Không yêu cầu đăng nhập */
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    if (category) {
      res.status(200).send({
        success: true,
        data: category
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Danh mục không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Không có ID phù hợp"
    });
  }
});

/* POST category: Yêu cầu mod */
router.post('/', checkRole('mod'), async function (req, res, next) {
  try {
    let newCategory = new categoryModel({
      name: req.body.name,
    });
    await newCategory.save();
    res.status(200).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
