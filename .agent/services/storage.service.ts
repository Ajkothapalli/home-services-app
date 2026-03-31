import { Env } from '../config/env';

// TODO: import AWS from 'aws-sdk';
// Or: import { Storage } from '@google-cloud/storage';

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  sizeBytes: number;
}

/**
 * Uploads a file (given as a local URI or Blob) to S3/GCS.
 * Returns the public URL and storage key.
 */
export async function upload(
  localUri: string,
  storagePath: string,
): Promise<UploadResult> {
  // TODO: Read file from localUri using react-native-fs or fetch
  // TODO: const s3 = new AWS.S3({ ... });
  // TODO: s3.putObject({ Bucket: Env.S3_BUCKET, Key: storagePath, Body: fileBuffer })
  throw new Error(`upload not implemented. Path: ${storagePath}, Bucket: ${Env.S3_BUCKET}`);
}

/**
 * Generates a pre-signed URL for temporary read access to a private file.
 */
export async function getSignedUrl(
  storagePath: string,
  expiresInSeconds: number = 3600,
): Promise<string> {
  // TODO: s3.getSignedUrl('getObject', { Bucket: Env.S3_BUCKET, Key: storagePath, Expires: expiresInSeconds })
  throw new Error(`getSignedUrl not implemented for path: ${storagePath}`);
}

/**
 * Deletes a file from storage by its key.
 */
export async function deleteFile(storagePath: string): Promise<void> {
  // TODO: s3.deleteObject({ Bucket: Env.S3_BUCKET, Key: storagePath })
  throw new Error(`deleteFile not implemented for path: ${storagePath}`);
}
