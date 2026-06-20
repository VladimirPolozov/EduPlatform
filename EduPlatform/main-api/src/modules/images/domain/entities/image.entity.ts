export class Image {
  id?: string;
  filename!: string;
  filepath!: string;
  courseId!: string;
  uploadedBy!: string;
  status!: 'processing' | 'ready' | 'failed';
  processedPath?: string;

  constructor(partial: Partial<Image>) {
    Object.assign(this, partial);
  }
}
