const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class UploadController {
  async uploadImage(req, res, next) {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'No image data provided. Please send a base64 image string.',
        });
      }

      console.log('Uploading image to Cloudinary...');
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'papalicious',
        resource_type: 'auto',
      });

      console.log('Upload successful:', uploadResponse.secure_url);
      res.status(200).json({
        success: true,
        url: uploadResponse.secure_url,
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Image upload failed',
        error: error.message,
      });
    }
  }
}

module.exports = new UploadController();
