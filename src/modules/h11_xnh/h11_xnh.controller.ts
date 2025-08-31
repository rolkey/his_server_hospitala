import { Controller } from '@nestjs/common';
import { H11XnhService } from './h11_xnh.service';

@Controller('h11_xnh')
export class H11XnhController {
  constructor(private readonly h11XnhService: H11XnhService) {}
}
