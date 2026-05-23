const tableService = require('../services/tableService');

class TableController {
  async getAllTables(req, res, next) {
    try {
      const tables = await tableService.getAllTables();
      res.status(200).json({
        success: true,
        tables,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTableById(req, res, next) {
    try {
      const table = await tableService.getTableById(req.params.tableId);
      res.status(200).json({
        success: true,
        table,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTable(req, res, next) {
    try {
      const table = await tableService.createTable(req.body);
      res.status(201).json({
        success: true,
        table,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTable(req, res, next) {
    try {
      const table = await tableService.updateTable(req.params.tableId, req.body);
      res.status(200).json({
        success: true,
        table,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTable(req, res, next) {
    try {
      const table = await tableService.deleteTable(req.params.tableId);
      res.status(200).json({
        success: true,
        message: 'Table deleted successfully',
        table,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableTables(req, res, next) {
    try {
      const { bookingDate, timeSlot, capacity } = req.query;
      const tables = await tableService.getAvailableTables(bookingDate, timeSlot, capacity);
      res.status(200).json({
        success: true,
        tables,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTableStatus(req, res, next) {
    try {
      const status = await tableService.getTableStatus(req.params.tableId);
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TableController();
