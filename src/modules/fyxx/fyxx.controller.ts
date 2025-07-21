import { Controller } from '@nestjs/common';
import { fyxxService } from './fyxx.service';

@Controller('fyxx')
export class fyxxController {
  constructor(private readonly fyxxService: fyxxService) {}
}
