import { Controller } from '@nestjs/common';
import { h00_mzzdService } from './h00_mzzd.service';

@Controller('h00_mzzd')
export class h00_mzzdController {
  constructor(private readonly h00_mzzdService: h00_mzzdService) {}
}
