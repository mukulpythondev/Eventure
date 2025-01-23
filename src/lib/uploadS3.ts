import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET as string,
  },
});

// Function to upload a file to S3
export async function uploadToS3(base64Data: string, folderName: string = ''): Promise<string> {
  // Convert Base64 string to Buffer
  const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const fileName = `${folderName}/${uuidv4()}${path.extname('.png')}`; // Generate a unique file name

  // Define parameters for the S3 upload
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET as string, // Ensure the bucket name is defined in environment variables
    Key: fileName,
    Body: buffer,
    ContentType: 'image/png', // Specify the content type (adjust as necessary)
  };

  try {
    // Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return fileUrl; // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload to S3');
  }
}
