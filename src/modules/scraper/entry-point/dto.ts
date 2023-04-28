import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetTransactionsQuery {
  @ApiProperty({
    required: true,
    example: "d187780e3fc08ac2ccc765c6376928aa64af1d101e80de6169cc61ba70cf6374,528a4877dd8fa0a7b6296ba30ee70cbd49ad579821e5658c681b83623c340469",
  })
  @IsString({ each: true })
  addresses: string;

  @ApiProperty({ required: false, example: "10" })
  @IsNumberString({ no_symbols: true }, {})
  @IsOptional()
  limit: string;

  @ApiProperty({ required: false, example: "0" })
  @IsNumberString({ no_symbols: true }, {})
  @IsOptional()
  offset: string;
}
