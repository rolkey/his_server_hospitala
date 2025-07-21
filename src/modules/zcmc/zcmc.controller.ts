import { Controller } from '@nestjs/common';
import { zcmcService } from './zcmc.service';

@Controller('zcmc')
export class zcmcController {
  constructor(private readonly zcmcService: zcmcService) {}
}
