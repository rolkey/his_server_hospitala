import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { H15SsxbTfService } from './h15-ssxb-tf.service';
import { CreateH15SsxbTfDto } from './dto/h15-ssxb-tf.dto';

@Controller('h15-ssxb-tf')
export class H15SsxbTfController {
  constructor(private readonly h15SsxbTfService: H15SsxbTfService) {}

  @Post()
  async add(@Body() createH15SsxbTfDto: CreateH15SsxbTfDto[]) {
    await this.h15SsxbTfService.add(createH15SsxbTfDto);
    return;
  }
}
