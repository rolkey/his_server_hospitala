import { Allow } from 'class-validator';

export class G_ksidDto {
  @Allow()
  xyksid: string;
  @Allow()
  cyksid: string;
  @Allow()
  zyksid: string;
  @Allow()
  clksid: string;
  @Allow()
  qtksid: string;
  @Allow()
  zjksid: string;
  @Allow()
  ssclksid: string;
}
