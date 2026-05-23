const Table = require('../models/Table');

class TableService {
  async getAllTables() {
    const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });
    return tables;
  }

  async getTableById(tableId) {
    const table = await Table.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }
    return table;
  }

  async createTable(tableData) {
    if (!tableData.tableNumber || !tableData.capacity) {
      throw new Error('Table number and capacity are required');
    }

    const existingTable = await Table.findOne({ tableNumber: tableData.tableNumber });
    if (existingTable) {
      throw new Error('Table with this number already exists');
    }

    const table = new Table(tableData);
    await table.save();
    return table;
  }

  async updateTable(tableId, updateData) {
    const table = await Table.findByIdAndUpdate(tableId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      throw new Error('Table not found');
    }

    return table;
  }

  async deleteTable(tableId) {
    const table = await Table.findByIdAndUpdate(
      tableId,
      { isActive: false },
      { new: true }
    );

    if (!table) {
      throw new Error('Table not found');
    }

    return table;
  }

  async getAvailableTables(bookingDate, timeSlot, capacity) {
    const Booking = require('../models/Booking');

    // Get all active tables that can accommodate the requested capacity
    const tables = await Table.find({
      isActive: true,
      capacity: { $gte: capacity },
    }).sort({ tableNumber: 1 });

    const targetDate = new Date(bookingDate);
    const startOfDay = new Date(targetDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setUTCHours(23, 59, 59, 999));

    const results = [];

    for (const table of tables) {
      const booking = await Booking.findOne({
        tableId: table._id,
        bookingDate: { $gte: startOfDay, $lte: endOfDay },
        timeSlot,
        status: { $in: ['confirmed', 'pending'] },
      }).populate('userId', 'name');

      const tableObj = table.toObject();

      if (booking) {
        tableObj.currentBooking = {
          guestName: booking.guestName,
          numberOfGuests: booking.numberOfGuests,
          status: booking.status
        };
      } else {
        tableObj.currentBooking = null;
      }
      
      results.push(tableObj);
    }

    return results;
  }

  async getTableStatus(tableId) {
    const Booking = require('../models/Booking');
    const table = await Table.findById(tableId);

    if (!table) {
      throw new Error('Table not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.find({
      tableId,
      bookingDate: { $gte: today },
    }).sort({ timeSlot: 1 });

    return {
      table,
      todayBookings,
      currentStatus: table.status,
    };
  }
}

module.exports = new TableService();
