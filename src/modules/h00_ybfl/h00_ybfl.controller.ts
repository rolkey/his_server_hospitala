import { Controller } from '@nestjs/common';
import { h00_ybflService } from './h00_ybfl.service';

@Controller('h00_ybfl')
export class h00_ybflController {
  constructor(private readonly h00_ybflService: h00_ybflService) {}
}
