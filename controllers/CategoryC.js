import HttpError from 'http-errors';
import { Categories } from '../models/index.js';

class CategoryC {
  // ***** API FOR CREATE CATEGORY *****
  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      const existingCategory = await Categories.findOne({
        where: { name },
      });
      if (existingCategory) {
        throw new HttpError(400, 'Category already exists');
      }
      const newCategory = await Categories.create({ name });

      res.json({
        message: 'Category created successfully',
        category: newCategory,
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** API FOR DELETE CATEGORY *****
  static async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await Categories.findByPk(categoryId);
      if (!category) {
        throw new HttpError(404, 'Category not found');
      }
      await category.destroy();
      res.json({
        message: 'Category deleted successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  // ***** API FOR CATEGORY LIST
  static async getCategoryList(req, res, next) {
    try {
      const list = await Categories.findAll();
      res.json({
        list,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default CategoryC;
