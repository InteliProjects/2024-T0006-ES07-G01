import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'A senha deve possuir no mínimo 8 caracteres' })
  name: string;
}

