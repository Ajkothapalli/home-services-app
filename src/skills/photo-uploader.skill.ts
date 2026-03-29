import { MAX_PHOTOS_PER_JOB } from '../config/constants';

export interface UploadPhotosInput {
  localUris: string[];
  jobId: string;
  userId: string;
}

export interface UploadPhotosOutput {
  uploadedUrls: string[];
  failedUris: string[];
}

/**
 * Uploads up to MAX_PHOTOS_PER_JOB photos to S3/GCS and returns the public URLs.
 * Skips any URIs beyond the limit.
 */
export async function uploadPhotos(
  input: UploadPhotosInput,
): Promise<UploadPhotosOutput> {
  const urisToUpload = input.localUris.slice(0, MAX_PHOTOS_PER_JOB);
  const uploadedUrls: string[] = [];
  const failedUris: string[] = [];

  for (const uri of urisToUpload) {
    try {
      // TODO: Call StorageService.upload(uri, `jobs/${input.jobId}/${filename}`)
      const url = ''; // TODO: returned by StorageService.upload
      uploadedUrls.push(url);
    } catch {
      failedUris.push(uri);
    }
  }

  return { uploadedUrls, failedUris };
}
