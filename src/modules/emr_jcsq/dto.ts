import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, IsNotEmpty, Allow, ValidateIf, Matches, IsArray, Length } from 'class-validator';


export class Zlxm {
    @IsNotEmpty()
    @IsString()
    xmid: string;

    @IsOptional()
    @IsString()
    gg?: string;

    @IsOptional()
    @IsString()
    scph?: string;

    @IsOptional()
    @IsString()
    dw?: string;

    @IsOptional()
    @IsString()
    scpc?: string;

    @IsOptional()
    @IsNumber()
    dj?: number;

    @IsOptional()
    @IsNumber()
    sl?: number;

    @IsOptional()
    @IsNumber()
    pfjg?: number;

    @IsOptional()
    @IsString()
    cjid?: string;

    @IsOptional()
    @IsNumber()
    yysl?: number;

    @IsOptional()
    @IsString()
    sxrq?: string;

    @IsOptional()
    @IsString()
    ypid?: string;

    @IsOptional()
    @IsString()
    ksid?: string;

    @IsOptional()
    @IsString()
    scrq?: string;

    @IsOptional()
    @IsNumber()
    xmlx?: number;

    @IsOptional()
    @IsString()
    xmmc?: string;

    @IsOptional()
    @IsString()
    gjybbm?: string;

    @IsOptional()
    @IsString()
    gjybmc?: string;

    @IsOptional()
    @IsString()
    yldw?: string;

    @IsOptional()
    @IsString()
    zflxid?: string;

    @IsOptional()
    @IsString()
    tempsl?: string;

    @IsOptional()
    @IsString()
    syffid?: string;

    @IsOptional()
    @IsString()
    syplid?: string;

    @IsOptional()
    @IsString()
    ypfl?: string;

    @IsOptional()
    @IsString()
    bzdm?: string;

    @IsOptional()
    @IsString()
    bz?: string;

    @IsOptional()
    @IsNumber()
    zfbl?: number;

    @IsOptional()
    @IsString()
    fylbid?: string;

    @IsOptional()
    @IsNumber()
    sfbz?: number;

    @IsOptional()
    @IsString()
    fybz?: string;

    @IsOptional()
    @IsNumber()
    ykbz?: number;

    @IsOptional()
    @IsNumber()
    ybbz?: number;

    @IsOptional()
    @IsNumber()
    zfje?: number;

    @IsOptional()
    @IsNumber()
    kyts?: number;

    @IsNotEmpty()
    @IsNumber()
    mxxh: number;

    @IsOptional()
    @IsNumber()
    tzbz?: number;
}
export class Jcbw {
    @IsNotEmpty()
    @IsString()
    bwid: string;

    @IsOptional()
    @IsString()
    bwmc?: string;

    @IsOptional()
    @IsString()
    jcxmid?: string;
}

export class Jcff {
    @IsNotEmpty()
    @IsString()
    ffid: string;

    @IsOptional()
    @IsString()
    bwmc?: string;

    @IsOptional()
    @IsString()
    jcxmid?: string;
}
export class QueryDto {

    @IsNotEmpty({ message: 'sqdh不能为空' })
    @IsOptional()
    sqdh?: string;
}

export class CreateDto {

    @IsOptional()
    @IsString()
    ylzh?: string; // 医疗账号

    @IsOptional()
    @IsString()
    mzid?: string; // 门诊id

    @IsOptional()
    @IsString()
    jzlx?: string; // 就诊类型1门诊2住院

    @IsOptional()
    @IsString()
    brxm?: string; // 病人姓名

    @IsOptional()
    @IsString()
    brxb?: string; // 病人性别

    @IsOptional()
    @IsString()
    brnl?: string; // 病人年龄

    @IsOptional()
    @IsString()
    sqys?: string; // 申请医生


    @IsOptional()
    @IsString()
    sqks?: string; // 申请科室

    @IsOptional()
    @IsString()
    shys?: string; // 审核医生

    @IsOptional()
    @IsString()
    zxks?: string; // 执行科室

    @IsOptional()
    @IsString()
    zxys?: string; // 执行医生

    @IsOptional()
    @IsString()
    tjys?: string; // 提交医生

    @IsOptional()
    @IsString()
    bgys?: string; // 报告医生

    @IsOptional()
    @IsString()
    jcmd?: string; // 检查目的

    @IsOptional()
    @IsString()
    bzxx?: string; // 备注信息

    @IsOptional()
    @IsString()
    zs?: string;

    @IsOptional()
    @IsString()
    xbs?: string;

    @IsOptional()
    @IsString()
    tz?: string;

    @IsOptional()
    @IsString()
    jczt?: string; // 检查状态

    @IsOptional()
    @IsString()
    icd10?: string; // ICD10 诊断编码

    @IsOptional()
    @IsString()
    jbmc?: string; // 疾病名称

    @IsOptional()
    @IsString()
    flid?: string;

    @IsNotEmpty({ message: 'sqsj不能为空' })
    @Transform(({ value }) => {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    })
    @IsOptional()
    sqsj?: Date;


    @IsOptional()
    @IsArray()
    jcbwList?: Jcbw[];

    @IsOptional()
    @IsArray()
    jcffList?: Jcff[];


    @IsOptional()
    @IsArray()
    zlxmList?: Zlxm[];

    @IsOptional()
    @IsString()
    jcbw?: string;

}

export class UpdateDto extends CreateDto {

    @IsNotEmpty({ message: 'sqdh不能为空' })
    @IsString()
    @Length(1, 36)
    sqdh: string; // 申请单号（主键）

    @IsOptional()
    @IsString()
    cfid?: string; // 处方id
}
export class SaveDto extends CreateDto {

    @IsOptional()
    sqdh?: string; // 申请单号（主键）

    @IsOptional()
    @IsString()
    cfid?: string; // 处方id
}








