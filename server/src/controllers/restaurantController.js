const Restaurant = require('../models/Restaurant');

class RestaurantController {
  async getSettings(req, res, next) {
    try {
      let settings = await Restaurant.findOne();
      if (!settings) {
        // Safe fallback if seeder wasn't run
        settings = new Restaurant({
          name: 'Papalicious',
          description: 'Experience authentic Odia cuisine with premium ambiance and service.',
          location: { address: 'Cuttack, Odisha', city: 'Cuttack', state: 'Odisha' },
          contact: { phone: '+91-123-456-7890', email: 'info@papalicious.com', website: 'https://papalicious.com' },
          openingHours: [
            { day: 'Mon-Fri', opening: '11:00 AM', closing: '10:00 PM', isClosed: false },
            { day: 'Sat-Sun', opening: '10:00 AM', closing: '11:00 PM', isClosed: false }
          ],
          logoImage: '',
          socialLinks: {
            facebook: 'https://facebook.com/papalicious',
            instagram: 'https://instagram.com/papalicious',
            twitter: 'https://twitter.com/papalicious'
          }
        });
        await settings.save();
      }
      res.status(200).json({
        success: true,
        settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      // Build a flat $set object using dot-notation to avoid
      // Mongoose casting issues on nested subdocuments (e.g. location.coordinates)
      const $set = {};

      if (req.body.name !== undefined) $set['name'] = req.body.name;
      if (req.body.description !== undefined) $set['description'] = req.body.description;
      if (req.body.logoImage !== undefined) $set['logoImage'] = req.body.logoImage;

      // Location — only update address/city/state, skip coordinates entirely
      if (req.body.location) {
        if (req.body.location.address !== undefined) $set['location.address'] = req.body.location.address;
        if (req.body.location.city !== undefined) $set['location.city'] = req.body.location.city;
        if (req.body.location.state !== undefined) $set['location.state'] = req.body.location.state;
        // NOTE: coordinates are intentionally NOT updated from admin panel
      }

      // Contact
      if (req.body.contact) {
        if (req.body.contact.phone !== undefined) $set['contact.phone'] = req.body.contact.phone;
        if (req.body.contact.email !== undefined) $set['contact.email'] = req.body.contact.email;
        if (req.body.contact.website !== undefined) $set['contact.website'] = req.body.contact.website;
      }

      // Social Links
      if (req.body.socialLinks) {
        if (req.body.socialLinks.facebook !== undefined) $set['socialLinks.facebook'] = req.body.socialLinks.facebook;
        if (req.body.socialLinks.instagram !== undefined) $set['socialLinks.instagram'] = req.body.socialLinks.instagram;
        if (req.body.socialLinks.twitter !== undefined) $set['socialLinks.twitter'] = req.body.socialLinks.twitter;
      }

      // Opening Hours (replace the whole array)
      const updateOp = { $set };
      if (req.body.openingHours && Array.isArray(req.body.openingHours)) {
        updateOp.$set['openingHours'] = req.body.openingHours;
      }

      // Use findOneAndUpdate with upsert so it works even if doc doesn't exist
      const settings = await Restaurant.findOneAndUpdate(
        {},
        updateOp,
        {
          new: true,         // return the updated document
          upsert: true,      // create if not found
          runValidators: false, // skip strict validation on partial updates
          setDefaultsOnInsert: true,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        settings,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RestaurantController();
