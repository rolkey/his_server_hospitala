import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { H31LyjlService } from './h31_lyjl.service';
import { H31Lyjl } from './h31_lyjl.entity';
import {

} from './h31_lyjl.dto';

@Controller('h31_lyjl')
export class H31LyjlController {
  constructor(private readonly h31LyjlService: H31LyjlService) { }

}
