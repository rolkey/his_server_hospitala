import { IsNumber, IsOptional, IsString, Min, Max, IsNotEmpty, IsArray, } from 'class-validator';

export class Zlxm {
    @IsNotEmpty()
    @IsString()
    xmid: string;

    @IsOptional()
    @IsNumber()
    xmzl?: number;

    @IsOptional()
    @IsString()
    xmmc?: string;
}

export class QueryDto {

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(1000, { message: 'pageSize必须大于零,最大值1000' })
    pageSize?: number;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'pageNo必须大于零' })
    pageNo?: number;

    @IsOptional()
    zt?: string;

    @IsOptional()
    bwmc?: string;

    @IsOptional()
    flid?: string;

    @IsOptional()
    @IsArray()
    bwid?: string[];

}
export class CreateDto {

    @IsOptional()
    zt?: string;

    @IsOptional()
    bwmc?: string;

    @IsOptional()
    pybm?: string;

    @IsOptional()
    wbbm?: string;

    @IsOptional()
    qtbm?: string;

    // @IsNotEmpty({ message: '分类ID不能为空' })
    @IsOptional()
    flid?: string;

}

export class UpdateDto extends CreateDto {

    @IsNotEmpty({ message: '部位ID不能为空' })
    @IsString()
    bwid?: string;

    @IsOptional()
    @IsArray()
    zlxmList?: Zlxm[];
}
