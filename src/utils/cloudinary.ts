import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

export const uploadImageToCloudinary = async (localFilePath: string) => {
	if (!localFilePath) {
		throw new Error('Local file path is required');
	}

	try {
		const res: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
			resource_type: 'image',
		});
		if (res && res.secure_url) {
			fs.unlinkSync(localFilePath);
			return res;
		} else {
			throw new Error('Unexpected response from Cloudinary');
		}
	} catch (error) {
		fs.unlinkSync(localFilePath); // Delete the local file on error
		throw error; // Re-throw the error after handling
	}
};
