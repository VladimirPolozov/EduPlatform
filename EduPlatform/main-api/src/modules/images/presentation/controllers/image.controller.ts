import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadImageDto } from '../dto/upload-image.dto';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@Controller('images')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher')
export class ImageController {
  constructor(
    private readonly uploadImageUseCase: UploadImageUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadImageDto, @Req() req: any) {
    return this.uploadImageUseCase.execute({
      filename: file.originalname,
      filepath: file.path,
      courseId: dto.courseId,
      uploadedBy: req.user.id,
    });
  }
}
