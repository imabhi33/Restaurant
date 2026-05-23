const menuService = require('../services/menuService');

class MenuController {
  async getMenuByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const items = await menuService.getMenuByCategory(category);
      res.status(200).json({
        success: true,
        items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMenuItems(req, res, next) {
    try {
      const items = await menuService.getAllMenuItems();
      res.status(200).json({
        success: true,
        items,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchMenuItems(req, res, next) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }
      const items = await menuService.searchMenuItems(query);
      res.status(200).json({
        success: true,
        items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenuItemById(req, res, next) {
    try {
      const item = await menuService.getMenuItemById(req.params.itemId);
      res.status(200).json({
        success: true,
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  async createMenuItem(req, res, next) {
    try {
      const item = await menuService.createMenuItem(req.body);
      res.status(201).json({
        success: true,
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req, res, next) {
    try {
      const item = await menuService.updateMenuItem(req.params.itemId, req.body);
      res.status(200).json({
        success: true,
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMenuItem(req, res, next) {
    try {
      const item = await menuService.deleteMenuItem(req.params.itemId);
      res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully',
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBestsellers(req, res, next) {
    try {
      const items = await menuService.getBestsellers();
      res.status(200).json({
        success: true,
        items,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MenuController();
