export class Lesson {
  id?: string;
  title!: string;
  content!: string;
  courseId!: string;
  order!: number;

  constructor(partial: Partial<Lesson>) {
    Object.assign(this, partial);
  }
}
