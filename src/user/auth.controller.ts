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
import { Types } from 'mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { GetUserDto } from './dto/get-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: AuthService,
    private i18nService: I18nService,
  ) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    // create user
    const user = await this.userService.createUser({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      userName: createUserDto.userName,
      email: createUserDto.email,
      password: createUserDto.password,
      roles: [],
    });
    delete user.password;
    return { ...user };
  }

  @Post('/login')
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

  // @Post("approve")
  // @UseGuards(AuthGuard)
  // @Roles(UserRoles.ADMIN)
  // async approveUser(@Body() approveUserDto: ApproveUserDto) {
  //     const userDetails = await this.userService.updateUser(new Types.ObjectId(approveUserDto.userId), {
  //         status: approveUserDto.status,
  //     });

  //     const isApproved = approveUserDto.status === UserStatus.APPROVED;
  //     let message = isApproved ? this.i18nService.t('email.USER_APPROVED') : this.i18nService.t('email.USER_REJECTED');
  //     [userDetails.firstName].forEach((text, index) => {
  //         message = message.replace(`{${index + 1}}`, text);
  //     })
  //     await sendMail(userDetails.email, message, isApproved);

  //     return userDetails;
  // }

  /**
   * filter, sorting, pagination
   * @param getUserDto
   * @returns
   */
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
    // get accesss to token
    // check the refresh token expiry
    // if refresh token is not expired then create login and refresh token
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
  // @Roles(UserRoles.ADMIN)
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(new Types.ObjectId(userId));
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // This route initiates the Google OAuth flow
    // The guard will redirect to Google
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res({ passthrough: true }) res) {
    // Handle the Google OAuth callback
    const loginResponse = await this.userService.googleLogin(req.user);
    this.sendCookie(res, 'refreshToken', loginResponse.refreshToken);

    // Redirect to frontend with token in URL or return JSON
    // Option 1: Return JSON (for API testing)
    return loginResponse;

    // Option 2: Redirect to frontend with token (uncomment if needed)
    // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // return res.redirect(`${frontendUrl}/auth/callback?token=${loginResponse.accessToken}`);
  }

  @Post('/google/token')
  async googleTokenLogin(
    @Body() googleTokenDto: GoogleTokenDto,
    @Res({ passthrough: true }) res,
  ) {
    // This endpoint accepts a Google ID token directly
    // Useful for mobile apps and API testing with Postman
    const loginResponse = await this.userService.googleTokenLogin(
      googleTokenDto.token,
    );
    this.sendCookie(res, 'refreshToken', loginResponse.refreshToken);
    return loginResponse;
  }

  sendCookie(res: any, cookieName: string, cookieValue: string) {
    res.cookie(cookieName, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/', // Changed from '/auth/google/token' to '/' so cookie works across all routes
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
