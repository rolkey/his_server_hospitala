import { Controller } from '@nestjs/common';
import { h00_syplService } from './H00_sypl.service';

@Controller('h00_sypl')
export class h00_syplController {
  constructor(private readonly h00_syplService: h00_syplService) {}
}
