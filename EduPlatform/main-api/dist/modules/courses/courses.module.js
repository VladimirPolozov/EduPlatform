"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const course_controller_1 = require("./presentation/controllers/course.controller");
const create_course_use_case_1 = require("./application/use-cases/create-course.use-case");
const get_course_use_case_1 = require("./application/use-cases/get-course.use-case");
const update_course_use_case_1 = require("./application/use-cases/update-course.use-case");
const delete_course_use_case_1 = require("./application/use-cases/delete-course.use-case");
const enroll_course_use_case_1 = require("./application/use-cases/enroll-course.use-case");
const course_repository_interface_1 = require("./domain/repositories/course.repository.interface");
const course_schema_1 = require("./infrastructure/database/course.schema");
const mongoose_course_repository_1 = require("./infrastructure/database/mongoose-course.repository");
const redis_cache_service_1 = require("./infrastructure/cache/redis-cache.service");
let CoursesModule = class CoursesModule {
};
exports.CoursesModule = CoursesModule;
exports.CoursesModule = CoursesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: course_schema_1.CourseDocumentClass.name, schema: course_schema_1.CourseSchema },
            ]),
            auth_module_1.AuthModule,
            config_1.ConfigModule,
            users_module_1.UsersModule,
        ],
        controllers: [course_controller_1.CourseController],
        providers: [
            {
                provide: course_repository_interface_1.ICourseRepository,
                useClass: mongoose_course_repository_1.MongooseCourseRepository,
            },
            redis_cache_service_1.RedisCacheService,
            create_course_use_case_1.CreateCourseUseCase,
            get_course_use_case_1.GetCourseUseCase,
            update_course_use_case_1.UpdateCourseUseCase,
            delete_course_use_case_1.DeleteCourseUseCase,
            enroll_course_use_case_1.EnrollCourseUseCase,
        ],
        exports: [course_repository_interface_1.ICourseRepository, mongoose_1.MongooseModule],
    })
], CoursesModule);
//# sourceMappingURL=courses.module.js.map