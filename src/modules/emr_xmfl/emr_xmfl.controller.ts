import { Controller, } from '@nestjs/common'
import { emr_xmflService } from './emr_xmfl.service';

@Controller('emr_xmfl')

export class emr_xmflController {
  constructor(private readonly emr_xmflService: emr_xmflService) { }


}
