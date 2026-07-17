import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRoles } from 'src/common/enum/userroles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { GetUserDto } from './dto/get-user.dto';
import { AuthService } from './auth.service';
import { AppOriginGuard } from 'src/guards/app-origin.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: AuthService,
    private i18nService: I18nService,
  ) {}

  @Post('/signup')
  @UseGuards(AppOriginGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      userName: createUserDto.userName,
      email: createUserDto.email,
      password: createUserDto.password,
      appId: createUserDto.appId,
      roles: [],
    });
    delete user.password;
    return { ...user };
  }

  @Post('/login')
  @UseGuards(AppOriginGuard)
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res,
  ) {
    const loginResponse = await this.userService.loginWithEmailAndPassword(
      loginUserDto,
    );
    this.sendCookie(res, 'refreshToken', loginResponse.refreshToken);
    return loginResponse;
  }

  @Get('/')
  verifyUser(@Req() request: Request) {
    let token =
      (request.headers['x-access-token'] as string) ||
      (request.headers['authorization'] as string);
    if (token == null) {
      throw new UnauthorizedException(
        this.i18nService.t('default.GUARD_TOKEN_REQUIRED'),
      );
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    return this.userService.verifyUser(token);
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  getUsers(@Query() getUserDto: GetUserDto) {
    return this.userService.getUsers(getUserDto);
  }

  @Get('/refreshSession')
  async getRefreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res,
  ): Promise<any> {
    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken == null) {
      throw new UnauthorizedException(
        this.i18nService.t('default.GUARD_TOKEN_REQUIRED'),
      );
    }
    this.sendCookie(res, 'refreshToken', refreshToken);
    return await this.userService.refreshSession(refreshToken);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard)
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates flow
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res({ passthrough: true }) res) {
    const loginResponse = await this.userService.googleLogin(req.user);
    this.sendCookie(res, 'refreshToken', loginResponse.refreshToken);
    return loginResponse;
  }

  @Post('/google/token')
  @UseGuards(AppOriginGuard)
  async googleTokenLogin(
    @Body() googleTokenDto: GoogleTokenDto,
    @Res({ passthrough: true }) res,
  ) {
    const loginResponse = await this.userService.googleTokenLogin(
      googleTokenDto.token,
      googleTokenDto.appId
    );
    this.sendCookie(res, 'refreshToken', loginResponse.refreshToken);
    return loginResponse;
  }

  sendCookie(res: any, cookieName: string, cookieValue: string) {
    res.cookie(cookieName, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
