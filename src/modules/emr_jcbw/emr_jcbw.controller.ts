import { Controller, } from '@nestjs/common'
import { emr_jcbwService } from './emr_jcbw.service';

@Controller('emr_jcbw')
export class emr_jcbwController {
  constructor(private readonly emr_jcbwService: emr_jcbwService) { }
}
