import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class QueryDto {
    @IsString()
    @IsNotEmpty({ message: 'syid不能为空' })
    syid: string;

    @IsString()
    @IsNotEmpty({ message: 'prid不能为空' })
    prid: string;

}