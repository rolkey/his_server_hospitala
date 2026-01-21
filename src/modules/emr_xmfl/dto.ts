import { IsNumber, IsOptional, IsString, Min, Max, IsNotEmpty, Allow, ValidateIf, Matches } from 'class-validator';

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
    flmc?: string;
}

export class CreateDto {

    @IsOptional()
    zt?: string;

    @IsOptional()
    flmc?: string;

    @IsOptional()
    pybm?: string;

    @IsOptional()
    wbbm?: string;

    @IsOptional()
    qtbm?: string;

    @IsOptional()
    sjfl?: string;
}

export class UpdateDto extends CreateDto {

    @IsString()
    @IsNotEmpty({ message: '分类ID不能为空' })
    flid?: string;
}








