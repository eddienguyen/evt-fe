import { uploadDirectory, downloadDirectory } from '../utils/s3';

const BUCKET_NAME = 'your-bucket-name'; // Replace with your bucket name
const PREFIX = ''; // Optional: set a prefix for the files in the S3 bucket

const command = process.argv[2];
const localPath = process.argv[3] || './dist'; // Default to dist folder

async function main() {
  try {
    switch (command) {
      case 'upload':
        console.log(`Uploading ${localPath} to S3...`);
        await uploadDirectory(localPath, BUCKET_NAME, PREFIX);
        console.log('Upload completed successfully!');
        break;
      
      case 'download':
        console.log(`Downloading from S3 to ${localPath}...`);
        await downloadDirectory(BUCKET_NAME, PREFIX, localPath);
        console.log('Download completed successfully!');
        break;
      
      default:
        console.error('Please specify either "upload" or "download" as the command');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();