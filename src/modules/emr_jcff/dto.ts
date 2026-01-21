import { IsNumber, IsOptional, IsString, Min, Max, IsNotEmpty, Allow, ValidateIf, Matches, IsArray } from 'class-validator';

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
    ffmc?: string;

    @IsOptional()
    flid?: string;
}

export class CreateDto {

    @IsOptional()
    zt?: string;

    @IsOptional()
    ffmc?: string;

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

    @IsNotEmpty({ message: '方法ID不能为空' })
    ffid?: string;

    @IsOptional()
    @IsArray()
    zlxmList?: Zlxm[];
}








