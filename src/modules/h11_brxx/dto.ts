import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Min,
  Max,
  Allow,
  IsNotEmpty,
  ValidateIf,
  ValidateBy,
  ValidationArguments,
  Length,
  IsString,
  isNumber,
  Matches,
  IsIn,
  IsArray,
} from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

// 身份证号校验函数
function isValidIdCard(idCard: string): boolean {
  // 18位身份证号码的正则表达式
  const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return reg.test(idCard);
}

// 身份证号校验装饰器
function IsIdCard(validationOptions?: any) {
  return ValidateBy(
    {
      name: 'isIdCard',
      validator: {
        validate: (value: any) => {
          if (!value) return true; // 如果为空则跳过验证
          return isValidIdCard(value);
        },
        defaultMessage: (args: ValidationArguments) => {
          return '请输入正确的身份证号码';
        },
      },
    },
    validationOptions,
  );
}

function OnlyOneOf(property: string, validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'onlyOneOf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const property = args.property;
          const obj = args.object as any;
          const v1 = obj[property];
          const v2 = obj[relatedPropertyName];
          if (!v1 && !v2) return true;
          if ((v1 && !v2) || (!v1 && v2)) return false;
          return true;
        },
        // defaultMessage(args: ValidationArguments) {
        //     const [relatedPropertyName] = args.constraints;
        //     return `${args.property}和${relatedPropertyName}不能同时为空`;
        // },
      },
    });
  };
}

export class CreateDto {
  @Allow()
  zybh?: string;
  @Allow()
  mzbh?: string;
  @Allow()
  zycs?: number;
  @Allow()
  brlxid?: string;
  @Allow()
  gfbh?: string;
  @Allow()
  brxm?: string;
  @Allow()
  xbid?: string;
  @Allow()
  brnl?: string;
  @Allow()
  csrq?: Date | string;
  @Allow()
  yebz?: number;
  @Allow()
  hyzkmc?: string;

  @Allow()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  hyid?: string;

  @Allow()
  csddmc?: string;
  @Allow()
  mzmc?: string;
  @Allow()
  gjid?: string;
  @Allow()
  sfzh?: string;
  @Allow()
  gzdw?: string;
  @Allow()
  dwdh?: string;

  @Allow()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  dwyb?: string;

  @Allow()
  hkdz?: string;

  @Allow()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  hkyb?: string;

  @Allow()
  lxrm?: string;
  @Allow()
  gxid?: string;
  @Allow()
  lxdz?: string;
  @Allow()
  lxdh?: string;
  @Allow()
  ryksid?: string;
  @Allow()
  ryksmc?: string;
  @Allow()
  rybs?: string;
  @Allow()
  rycw?: string;
  @Allow()
  rysj?: Date | string;
  @Allow()
  rybqid?: string;
  @Allow()
  zkbqid?: string;
  @Allow()
  cyksid?: string;
  @Allow()
  cyksmc?: string;
  @Allow()
  cybs?: string;
  @Allow()
  cycw?: string;
  @Allow()
  cysj?: Date | string;
  @Allow()
  zyts?: number;
  @Allow()
  mzzd?: string;
  @Allow()
  ryzd?: string;
  @Allow()
  ryqzsj?: Date | string;
  @Allow()
  zyzt?: number;
  @Allow()
  yzxs?: number;
  @Allow()
  yzzj?: number;
  @Allow()
  qfje?: number;
  @Allow()
  fdje?: number;
  @Allow()
  etys?: number;
  @Allow()
  mzys?: string;
  @Allow()
  hlzt?: number;
  @Allow()
  cwbz?: number;
  @Allow()
  qfjsbz?: string;
  @Allow()
  qfjsje1?: number;
  @Allow()
  qfjsje?: number;
  @Allow()
  jssj?: Date | string;
  @Allow()
  lsh?: string;
  @Allow()
  cyzd?: string;
  @Allow()
  hbh?: string;
  @Allow()
  cyzd1?: string;
  @Allow()
  lsh1?: string;
  @Allow()
  jsdh?: string;
  @Allow()
  cyzd2?: string;
  @Allow()
  bahm?: string;
  @Allow()
  sfdm?: string;
  @Allow()
  nldw?: string;
  @Allow()
  jtdh?: string;
  @Allow()
  ryff?: string;
  @Allow()
  etcstz?: string;
  @Allow()
  etrytz?: string;
  @Allow()
  zkksid?: string;
  @Allow()
  bz1?: string;
  @Allow()
  bz2?: string;
  @Allow()
  bz3?: string;
  @Allow()
  jgdm?: string;
  @Allow()
  hljl?: string;
  @Allow()
  ysdm?: string;
  @Allow()
  nldw1?: string;
  @Allow()
  czry?: string;

  @Allow()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  hkyb1?: string;

  @Allow()
  bzxx?: string;
  @Allow()
  dbry?: string;
  @Allow()
  dbdh?: string;
  @Allow()
  mmlsh?: string;
  @Allow()
  bz4?: string;
  @Allow()
  patient_id?: string;
  @Allow()
  swrq?: string;
  @Allow()
  szbz?: number;
  @Allow()
  sjdm?: string;
  @Allow()
  xjdm?: string;
  @Allow()
  ylzh?: string;
  @Allow()
  cyzd3?: string;
  @Allow()
  cyzd4?: string;
  @Allow()
  cyzd5?: string;
  @Allow()
  jsry?: string;
  @Allow()
  GG1?: string;
  @Allow()
  GG2?: string;
  @Allow()
  GG3?: string;
  @Allow()
  XZZ1?: string;
  @Allow()
  XZZ2?: string;
  @Allow()
  XZZ3?: string;
  @Allow()
  XZZ4?: string;
  @Allow()
  XZZ5?: string;
  @Allow()
  HKDZ1?: string;
  @Allow()
  HKDZ2?: string;
  @Allow()
  HKDZ3?: string;
  @Allow()
  HKDZ4?: string;
  @Allow()
  HKDZ5?: string;
  @Allow()
  ryzd1?: string;
  @Allow()
  yish?: string;
  @Allow()
  zrhs?: string;
  @Allow()
  qt1?: string;
  @Allow()
  qt2?: string;
  @Allow()
  sflx?: string;
  @Allow()
  sxys?: string;
  @Allow()
  dqbm?: string;
  @Allow()
  infection_sync?: string;
  @Allow()
  tzdh?: string;
  @Allow()
  fyid?: string;


}

export class QueryDto {
  @Allow()
  brxm?: string;

  @ValidateIf((o) => o.dh !== undefined && o.dh !== '')
  @Length(5, 18, { message: '身份证长度必须在5-18个字符之间' })
  sfzh?: string;

  @ValidateIf((o) => o.ylzh !== undefined && o.ylzh !== '')
  @Length(3, 18, { message: '医疗证号长度必须在3-18个字符之间' })
  ylzh?: string;

  @ValidateIf((o) => o.zybh !== undefined && o.zybh !== '')
  @Length(3, 18, { message: 'zybh长度必须在3-18个字符之间' })
  zybh?: string;

  @Allow()
  zyzt?: number;

  @ValidateIf((o) => o.jtdh !== undefined && o.jtdh !== '')
  @Length(2, 13, { message: '电话长度必须在2-13个字符之间' })
  jtdh?: string;

  @Allow()
  rycw?: string;

  @Allow()
  mzys?: string;

  @Allow()
  sxys?: string;

  @Allow()
  ryksid?: string;

  @Allow()
  zkksid?: string;

  @OnlyOneOf('ryjssj', { message: '入院开始时间和入院结束时间不能同时为空' })
  rykssj?: string;

  @OnlyOneOf('rykssj', { message: '入院开始时间和入院结束时间不能同时为空' })
  ryjssj?: string;

  @OnlyOneOf('cyjssj', { message: '出院开始时间和出院结束时间不能同时为空' })
  cykssj?: string;

  @OnlyOneOf('cykssj', { message: '出院开始时间和出院结束时间不能同时为空' })
  cyjssj?: string;

  @Allow()
  isZk?: string; // 1. 是 0. 否
}

export class Queryh11_brxxDto extends QueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000, { message: 'pageSize必须大于零,最大值1000' })
  pageSize?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'pageNo必须是数字' })
  @Min(1, { message: 'pageNo必须大于零' })
  pageNo?: number;

  @Allow()
  value?: string;

  @Allow()
  cycw?: string;

  @Allow()
  brlxid?: string;

  @Allow()
  fyksid?: string;

  @Allow()
  checkAdvice?: boolean;

  @Allow()
  executeType?: string;

  @Allow()
  zxrq?: string;
}

export class receiptDto extends QueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000, { message: 'pageSize必须大于零,最大值1000' })
  pageSize?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'pageNo必须是数字' })
  @Min(1, { message: 'pageNo必须大于零' })
  pageNo?: number;

  @Allow()
  value?: string;

  @Allow()
  cycw?: string;

  @Allow()
  fylbid?: string;

  @Allow()
  dyflid?: string;
}

export class UpdateDto extends CreateDto {
  @Allow()
  @IsNotEmpty({ message: 'zyid不能为空' })
  @IsString()
  zyid: string;
}

export class QueryCostDetailDto {
  @IsNotEmpty({ message: 'ZYID不能为空' })
  @IsString()
  zyid?: string;

  @IsNotEmpty({ message: '费用开始日期不能为空' })
  @Matches(/^\d{4}.\d{2}.\d{2}$/, {
    message: '日期格式必须为YYYY.MM.DD',
  })
  @IsString()
  start?: string;

  @IsNotEmpty({ message: '费用结束日期不能为空' })
  @Matches(/^\d{4}.\d{2}.\d{2}$/, {
    message: '日期格式必须为YYYY.MM.DD',
  })
  @IsString()
  end?: string;

  @Allow()
  ksid?: string;
}

export class QueryCostCategoryDto {
  @IsNotEmpty({ message: 'ZYID不能为空' })
  @IsString()
  zyid?: string;

  @IsNotEmpty({ message: '病人类型ID不能为空' })
  @IsString()
  brlxid?: string;

  @IsNotEmpty({ message: '费用开始日期不能为空' })
  @Matches(/^\d{4}.\d{2}.\d{2}$/, {
    message: '日期格式必须为YYYY.MM.DD',
  })
  @IsString()
  start?: string;

  @IsNotEmpty({ message: '费用结束日期不能为空' })
  @Matches(/^\d{4}.\d{2}.\d{2}$/, {
    message: '日期格式必须为YYYY.MM.DD',
  })
  @IsString()
  end?: string;

  @Allow()
  ksid?: string;
}

export class bedAllocationDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid?: string;

  @IsNotEmpty({ message: 'cwid不能为空' })
  cwid?: string;

  @IsNotEmpty({ message: 'ksid不能为空' })
  ksid?: string;

  @IsNotEmpty({ message: 'rysj不能为空' })
  rysj?: Date;

  @IsNotEmpty({ message: 'lryid不能为空' })
  lryid?: string;

  @IsNotEmpty({ message: 'lryxm不能为空' })
  lryxm?: string;
}

export class ForciblyDeleteDto {

  @IsNotEmpty({ message: 'ZYID不能为空' })
  @IsString()
  zyid?: string;

  @IsNotEmpty({ message: '操作人KSID不能为空' })
  @IsString()
  czrKsid?: string;

  @IsOptional()
  @IsString()
  ghbh?: string;

  @IsOptional()
  @IsString()
  pwd?: string;


}

export class TransferDepartmentDto {
  @IsNotEmpty({ message: '住院ID不能为空' })
  @IsString()
  zyid: string;

  @IsNotEmpty({ message: '转科科室ID不能为空' })
  @IsString()
  zkksid: string;

  @IsNotEmpty({ message: '转科时间不能为空' })
  zksj: Date | string;

  @IsNotEmpty({ message: '当前科室ID不能为空' })
  @IsString()
  ksid: string;

  @IsNotEmpty({ message: '操作人ID不能为空' })
  @IsString()
  userid: string;

  @IsOptional()
  @IsString()
  gfbh?: string; // 工费编号(养老使用)
}
