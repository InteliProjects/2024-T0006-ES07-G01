import { Controller, Body, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() { ...userData }: CreateUserDto,
  ): Promise<string> {

    await this.userService.insertUser(userData);

    return 'Usuário cadastrado com sucesso';
  }
}
