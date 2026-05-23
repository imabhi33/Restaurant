const eventService = require('../services/eventService');

class EventController {
  async getAllEvents(req, res, next) {
    try {
      // If requested by admin, let's allow fetching inactive ones too if needed
      const includeInactive = req.query.admin === 'true';
      const events = await eventService.getAllEvents(includeInactive);
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.eventId);
      res.status(200).json({
        success: true,
        event,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body);
      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const event = await eventService.updateEvent(req.params.eventId, req.body);
      res.status(200).json({
        success: true,
        event,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const event = await eventService.deleteEvent(req.params.eventId);
      res.status(200).json({
        success: true,
        message: 'Cultural experience event deleted successfully',
        event,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
