const PriceListItem = require('../models/PriceListItem');

class PriceListController {
  async getAll(req, res, next) {
    try {
      const items = await PriceListItem.find({ availability: true }).sort({ category: 1, sortOrder: 1, name: 1 });
      res.status(200).json({ success: true, items });
    } catch (error) { next(error); }
  }

  async getAllForAdmin(req, res, next) {
    try {
      const items = await PriceListItem.find().sort({ category: 1, sortOrder: 1, name: 1 });
      res.status(200).json({ success: true, items });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const item = await PriceListItem.create(req.body);
      res.status(201).json({ success: true, item });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const item = await PriceListItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: 'Price-list item not found' });
      res.status(200).json({ success: true, item });
    } catch (error) { next(error); }
  }

  async remove(req, res, next) {
    try {
      const item = await PriceListItem.findByIdAndUpdate(req.params.itemId, { availability: false }, { new: true });
      if (!item) return res.status(404).json({ success: false, message: 'Price-list item not found' });
      res.status(200).json({ success: true, item });
    } catch (error) { next(error); }
  }
}

module.exports = new PriceListController();
