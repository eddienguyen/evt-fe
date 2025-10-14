import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as fs from 'fs';
import * as path from 'path';

const s3Client = new S3Client({
  region: 'ap-southeast-1', // Your AWS region
});

export const uploadDirectory = async (
  localPath: string,
  bucketName: string,
  prefix = ''
) => {
  const files = fs.readdirSync(localPath);

  for (const file of files) {
    const filePath = path.join(localPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively upload directories
      await uploadDirectory(
        filePath,
        bucketName,
        path.join(prefix, file)
      );
    } else {
      // Upload file
      const fileStream = fs.createReadStream(filePath);
      const key = path.join(prefix, file);

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: fileStream,
        },
      });

      try {
        await upload.done();
        console.log(`Successfully uploaded ${key}`);
      } catch (err) {
        console.error(`Error uploading ${key}:`, err);
      }
    }
  }
};

export const downloadDirectory = async (
  bucketName: string,
  prefix: string,
  localPath: string
) => {
  try {
    const { GetObjectCommand, ListObjectsV2Command } = await import('@aws-sdk/client-s3');
    const objects = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      })
    );

    if (!objects.Contents) {
      throw new Error('No objects found');
    }

    for (const object of objects.Contents) {
      if (!object.Key) continue;

      const localFilePath = path.join(
        localPath,
        object.Key.replace(prefix, '')
      );

      // Create directory if it doesn't exist
      fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

      const { Body } = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: object.Key,
        })
      );

      if (Body instanceof require('stream').Readable) {
        const writeStream = fs.createWriteStream(localFilePath);
        await new Promise((resolve, reject) => {
          Body.pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
        });
        console.log(`Successfully downloaded ${object.Key}`);
      }
    }
  } catch (err) {
    console.error('Error downloading directory:', err);
    throw err;
  }
};