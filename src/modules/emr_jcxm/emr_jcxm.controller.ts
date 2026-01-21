import { Controller, } from '@nestjs/common'
import { emr_jcxmService } from './emr_jcxm.service';

@Controller('emr_jcxm')

export class emr_jcxmController {
  constructor(
    private readonly emr_jcxmService: emr_jcxmService

  ) { }

}
