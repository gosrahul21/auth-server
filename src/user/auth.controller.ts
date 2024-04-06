import { TokenService } from './services/token.service';
import { Body, Controller, Get, Param, Post, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request } from "express";
import { I18nService } from "nestjs-i18n";
import { Roles } from "src/common/decorator/roles.decorator";
import { UserRoles } from "src/common/enum/userroles.enum";
import { Types } from "mongoose";
import { ApproveUserDto } from "./dto/approve-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { GetUserDto } from "./dto/get-user.dto";
import sendMail from "src/mail";
import { UserStatus } from "src/common/enum/user-status.enum";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: AuthService,
        private i18nService: I18nService,) { }

    @Post("/signup")
    async createUser(@Body() createUserDto: CreateUserDto) {
        // create user
        const user = await this.userService.createUser({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            userName: createUserDto.userName,
            email: createUserDto.email,
            password: createUserDto.password,
            roles:[]
        });
        delete user.password;
        return { ...user };
    }

    @Post('/login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.userService.loginWithEmailAndPassword(loginUserDto);
    }

    @Get('/')
    verifyUser(@Req() request: Request) {
        let token =
            request.headers['x-access-token'] as string || request.headers['authorization'] as string;
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
    async getRefreshToken(@Req() req: any): Promise<any> {
        // get accesss to token
        // check the refresh token expiry
        // if refresh token is not expired then create login and refresh token
        let refreshToken = req.headers['refresh-token'];
        if (refreshToken == null) {
            throw new UnauthorizedException(
                this.i18nService.t('default.GUARD_TOKEN_REQUIRED'),
            );
        }

        if (refreshToken.startsWith('Bearer ')) {
            refreshToken = refreshToken.slice(7, refreshToken.length);
        }
        return await this.userService.refreshSession(refreshToken);
    }

    @Get('/:userId')
    @UseGuards(AuthGuard)
    // @Roles(UserRoles.ADMIN)
    async getUserById(@Param('userId') userId: string) {
        return this.userService.getUserById(new Types.ObjectId(userId));
    }
}