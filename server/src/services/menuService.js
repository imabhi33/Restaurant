const MenuItem = require('../models/MenuItem');

class MenuService {
  async getMenuByCategory(category) {
    const menu = await MenuItem.find({
      category,
      availability: true,
    }).sort({ bestseller: -1, rating: -1 });

    return menu;
  }

  async getAllMenuItems() {
    const items = await MenuItem.find({ availability: true }).sort({
      category: 1,
      bestseller: -1,
      rating: -1,
    });

    return items;
  }

  async searchMenuItems(query) {
    const items = await MenuItem.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
      availability: true,
    });

    return items;
  }

  async getMenuItemById(itemId) {
    const item = await MenuItem.findById(itemId);
    if (!item) {
      throw new Error('Menu item not found');
    }
    return item;
  }

  async createMenuItem(itemData) {
    if (!itemData.name || !itemData.category || !itemData.price) {
      throw new Error('Name, category, and price are required');
    }

    const item = new MenuItem(itemData);
    await item.save();
    return item;
  }

  async updateMenuItem(itemId, updateData) {
    const item = await MenuItem.findByIdAndUpdate(itemId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      throw new Error('Menu item not found');
    }

    return item;
  }

  async deleteMenuItem(itemId) {
    const item = await MenuItem.findByIdAndUpdate(
      itemId,
      { availability: false },
      { new: true }
    );

    if (!item) {
      throw new Error('Menu item not found');
    }

    return item;
  }

  async getBestsellers() {
    const items = await MenuItem.find({
      bestseller: true,
      availability: true,
    }).limit(10);

    return items;
  }

  async getSpecialityItems() {
    const items = await MenuItem.find({
      tags: 'special',
      availability: true,
    });

    return items;
  }
}

module.exports = new MenuService();
