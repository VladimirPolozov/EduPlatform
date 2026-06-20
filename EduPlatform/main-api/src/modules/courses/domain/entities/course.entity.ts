export class Course {
  id?: string;
  title!: string;
  description!: string;
  teacherId!: string;
  price!: number;

  constructor(partial: Partial<Course>) {
    Object.assign(this, partial);
  }
}
