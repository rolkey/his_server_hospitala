import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsNotEmpty,
  Allow,
  ValidateIf,
  Matches,
} from 'class-validator';

export class Carete_Report_CategoryDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '上级ID不能为空' })
  parent_id: string;
}

export class Updateh_Report_CategoryDto extends Carete_Report_CategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'ID不能为空' })
  sys_report_category_id: string;
}

export class Carete_Report_InfomationDto {
  @IsString()
  @IsNotEmpty({ message: '分类ID不能为空' })
  report_category_id: string;

  @IsString()
  @IsNotEmpty({ message: '代码不能为空' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsNumber()
  valid?: number;

  @IsString()
  print_type: string;
}

export class Update_Report_InfomationDto extends Carete_Report_InfomationDto {
  @IsString()
  @IsNotEmpty({ message: '报表信息不能为空' })
  sys_report_information_id: string;
}

export class Get_Report_InfomationDto {
  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;

  @Allow()
  report_category_id: string;
}
