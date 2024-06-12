import { User } from '@prisma/client';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Length,
    Min,
    IsOptional,
    IsArray,
  } from 'class-validator';
  
  export class CreateVideoDto {
    @IsNotEmpty({ message: 'Informe um link' })
    @IsString({ message: 'link deve ser uma string' })
    linkS3: string;
    
    usuario: {
      connect: {
        id: number; // Supondo que `id` seja a chave primária do usuário
      };
    };
  }
  
  export class UpdateVideoDto {
    @IsOptional()
    @IsString({ message: 'linkS3 deve ser uma string' })
    linkS3?: string;

    @IsOptional()
    @IsString({message: " linkTranscricao deve ser uma string"})
    linkTranscricao?: string;

    @IsOptional()
    @IsString({ message: 'A descricao_curta deve ser uma string' })
    @Length(1, 150, {
      message: 'A descricao_curta deve ter entre 1 e 150 caracteres',
    })
    descricaoCurta?: string;

    @IsOptional()
    @IsString({ message: 'A descricao_longa deve ser uma string' })
    @Length(1, 1000, {
      message: 'A descricao_longa deve ter entre 1 e 1000 caracteres',
    })
    descricaoLonga?: string;

    @IsOptional()
    @IsArray({message: 'transcricao_processada deve ser um array das palavras restantes'})
    transcricaoProcessada?: string[]
  
    @IsOptional()
    @IsString({ message: 'A categoria deve ser string' })
    categoria?: string;

    @IsOptional()
    @IsArray({message: 'tags deve ser um array de tags'})
    tags?: string[]
  }
  