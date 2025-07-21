import { Controller } from '@nestjs/common';
import { csxzService } from './csxz.service';

@Controller('csxz')
export class csxzController {
  constructor(private readonly csxzService: csxzService) {}
}
