import { Controller } from '@nestjs/common';
import { h00_cwxxService } from './h00_cwxx.service';

@Controller('h00_cwxx')
export class h00_cwxxController {
  constructor(private readonly h00_cwxxService: h00_cwxxService) {}
}
