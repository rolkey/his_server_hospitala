import { Controller } from '@nestjs/common';
import { jbbmicd10Service } from './jbbmicd10.service';

@Controller('jbbmicd')
export class jbbmicd10Controller {
  constructor(private readonly jbbmicd10Service: jbbmicd10Service) {}
}
