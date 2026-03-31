export const ON_PHOTO_UPLOADED = 'on_photo_uploaded';

export interface OnPhotoUploadedPayload {
  jobId: string;
  userId: string;
  photoUrls: string[];
}

/**
 * Fires when photos are successfully uploaded for a job.
 * Triggers: photo-analyzer.skill to begin vision analysis.
 */
export async function handlePhotoUploaded(payload: OnPhotoUploadedPayload): Promise<void> {
  const { jobId, photoUrls } = payload;
  // TODO: Call analyzePhotos skill with photoUrls and job context
  // TODO: Append analysis result to job record
  console.log(`[Hook:${ON_PHOTO_UPLOADED}] ${photoUrls.length} photo(s) uploaded for job ${jobId}`);
}

// eventBus.on(ON_PHOTO_UPLOADED, handlePhotoUploaded);
