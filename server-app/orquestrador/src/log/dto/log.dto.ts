import { IsString, MinLength, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLogDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'A senha deve possuir no mínimo 8 caracteres' })
  processo: string;

  user: {
    connect: {
      id: number;
    }
  }

  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsNumber()
  timestamp: number;

  @IsOptional()
  @IsString({ message: "from deve ser uma string"})
  from: string;

  @IsOptional()
  @IsString({ message: "to deve ser uma string"})
  to: string;

  @IsOptional()
  @IsNumber()
  tempo_de_processamento: number;

}

