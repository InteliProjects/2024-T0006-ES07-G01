import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '.prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(userId: number): Promise<User> {
    const user: User | null = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }

  async getUserByName(name: string): Promise<User> {
    const user: User | null = await this.userRepository.getUserByName(name);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }

  async insertUser(userData: CreateUserDto): Promise<User> {
    const encryptedUserData: CreateUserDto = {
      ...userData,
      
    };

    return this.userRepository.createUser(encryptedUserData);
  }

}
