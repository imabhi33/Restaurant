const Event = require('../models/Event');

class EventService {
  async getAllEvents(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    const events = await Event.find(filter).sort({ createdAt: -1 });
    return events;
  }

  async getEventById(eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async createEvent(eventData) {
    if (!eventData.title || !eventData.subtitle || !eventData.description || !eventData.timing || !eventData.badge) {
      throw new Error('Title, subtitle, description, timing, and badge are required');
    }

    const event = new Event(eventData);
    await event.save();
    return event;
  }

  async updateEvent(eventId, updateData) {
    const event = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  async deleteEvent(eventId) {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }
}

module.exports = new EventService();
