"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("../auth/auth.module");
const courses_module_1 = require("../courses/courses.module");
const lesson_controller_1 = require("./presentation/controllers/lesson.controller");
const create_lesson_use_case_1 = require("./application/use-cases/create-lesson.use-case");
const get_lessons_by_course_use_case_1 = require("./application/use-cases/get-lessons-by-course.use-case");
const update_lesson_use_case_1 = require("./application/use-cases/update-lesson.use-case");
const delete_lesson_use_case_1 = require("./application/use-cases/delete-lesson.use-case");
const lesson_repository_interface_1 = require("./domain/repositories/lesson.repository.interface");
const lesson_schema_1 = require("./infrastructure/database/lesson.schema");
const mongoose_lesson_repository_1 = require("./infrastructure/database/mongoose-lesson.repository");
let LessonsModule = class LessonsModule {
};
exports.LessonsModule = LessonsModule;
exports.LessonsModule = LessonsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: lesson_schema_1.LessonDocumentClass.name, schema: lesson_schema_1.LessonSchema },
            ]),
            auth_module_1.AuthModule,
            courses_module_1.CoursesModule,
        ],
        controllers: [lesson_controller_1.LessonController],
        providers: [
            {
                provide: lesson_repository_interface_1.ILessonRepository,
                useClass: mongoose_lesson_repository_1.MongooseLessonRepository,
            },
            create_lesson_use_case_1.CreateLessonUseCase,
            get_lessons_by_course_use_case_1.GetLessonsByCourseUseCase,
            update_lesson_use_case_1.UpdateLessonUseCase,
            delete_lesson_use_case_1.DeleteLessonUseCase,
        ],
    })
], LessonsModule);
//# sourceMappingURL=lessons.module.js.map