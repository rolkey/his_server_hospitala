import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11FpxbService } from './h11_fpxb.service';

@Controller('h11_fpxb')
export class H11FpxbController {
  constructor(private readonly h11FpxbService: H11FpxbService) {}
}
