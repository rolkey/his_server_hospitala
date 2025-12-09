import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { KsryService } from './ksry.service';

@Controller('ksry')
export class KsryController {
  constructor(private readonly service: KsryService) {}
}
