import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      "File has been uploaded successfully on cloudinary: ",
      response.url
    );
    const url = response.secure_url;
    const publicId = response.public_id;
    fs.unlinkSync(localFilePath);
    return { url, publicId };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, (result) => {
      console.log(result);
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const uploadMultipleFiles = async (localFilePaths) => {
  try {
    if (!localFilePaths || localFilePaths.length === 0) return [];

    const uploadedFiles = [];
    for (const filePath of localFilePaths) {
      const response = await uploadOnCloudinary(filePath);
      if (response) {
        console.log(response);
        uploadedFiles.push(response.secure_url);
      }
    }

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading Files: ", error);
    localFilePaths.forEach((filePath) => fs.unlinkSync(filePath));
    return [];
  }
};

export { uploadOnCloudinary, uploadMultipleFiles, deleteFromCloudinary };
