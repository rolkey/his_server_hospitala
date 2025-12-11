import { Controller } from '@nestjs/common';
import { h13_djdyService } from './h13_djdy.service';

@Controller('h13_djdy')
export class h13_djdyController {
  constructor(private readonly h13_djdyService: h13_djdyService) { }
}
