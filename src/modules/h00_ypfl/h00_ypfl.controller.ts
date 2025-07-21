import { Controller } from '@nestjs/common';
import { h00_ypflService } from './h00_ypfl.service';

@Controller('h00_ypfl')
export class h00_ypflController {
  constructor(private readonly h00_ypflService: h00_ypflService) {}
}
