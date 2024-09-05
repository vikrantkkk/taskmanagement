const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
  console.log("🚀 ~ process.env.CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET)
  console.log("🚀 ~ process.env.CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME)
  console.log("🚀 ~ process.env.CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY)

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath); // Delete local file after upload
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove temporary file on error
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};

module.exports = uploadOnCloudinary;
