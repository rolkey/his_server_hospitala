import { Controller } from '@nestjs/common';
import { emr_jcffService } from './emr_jcff.service';

@Controller('emr_jcff')
export class emr_jcffController {
  constructor(private readonly emr_jcffService: emr_jcffService) {}
}
