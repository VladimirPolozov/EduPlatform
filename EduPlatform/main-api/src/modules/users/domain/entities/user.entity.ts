export class User {
  id?: string;
  name!: string;
  email!: string;
  password?: string;
  role!: 'student' | 'teacher';
  enrolledCourses!: string[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
