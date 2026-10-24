import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder = "techupskills-products"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};