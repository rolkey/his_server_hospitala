import { Controller } from '@nestjs/common';
import { h00_syffService } from './h00_syff.service';

@Controller('h00_syff')
export class h00_syffController {
  constructor(private readonly h00_syffService: h00_syffService) {}
}
