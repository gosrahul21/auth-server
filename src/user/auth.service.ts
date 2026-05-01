import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { User, UserDocument } from './entity/user.entity';
import { throwErrorMessage } from '../common/utils/throwErrorMessage';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { createErrorLog } from '../common/utils/logger';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { GetUserDto } from './dto/get-user.dto';
import { SortType } from 'src/common/enum/sort.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly i18nService: I18nService,
    private readonly tokenService: TokenService,
    private readonly authService: PasswordService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async loginWithEmailAndPassword(loginUserDto: LoginUserDto) {
    try {
      // check if the value is email or userName, search for email if email or passowrd
      let filterQuery;
      if (loginUserDto.emailOrUserName.includes('@')) {
        filterQuery = { email: loginUserDto.emailOrUserName };
        console.log(filterQuery);
      } else {
        filterQuery = { userName: loginUserDto.emailOrUserName };
      }

      const user = await this.userModel.findOne(filterQuery).populate('roles');
      if (!user) {
        createErrorLog(
          `${this.i18nService.t('user.User_not_available')}`,
          'login-service',
          filterQuery,
        );
        throw new NotFoundException(
          this.i18nService.t('user.USER_NOT_AVAILABLE'),
        );
      }
      // check if the password is valid

      const isEqual = await this.authService.comparePasswords(
        loginUserDto.password,
        user.password,
      );
      if (!isEqual) {
        createErrorLog(
          `${this.i18nService.t('user.Invalid_pin')}`,
          'login-service',
          filterQuery,
        );
        throw new ForbiddenException(this.i18nService.t('user.Invalid_pin'));
      } else {
        const payload = {
          userId: user._id,
          email: user.email,
          userName: user.userName,
          role: user.roles,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
        };
        const { accessToken, refreshToken } =
          this.tokenService.generateAuthToken(payload);
        return { accessToken, refreshToken };
      }
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.Error_in_user_login')}`,
        'login-service',
        {
          email: loginUserDto.emailOrUserName,
          error: error.message,
        },
      );
      throwErrorMessage(error);
    }
  }

  async createUser(userData: User): Promise<any> {
    try {
      const user = await this.userModel.findOne({
        email: userData.email,
      });
      if (!user) {
        // create password hash only if password is provided
        let password = userData.password;
        if (password) {
          password = await this.authService.createPasswordHash(password);
        }
        const newUser = new this.userModel({
          ...userData,
          password,
        });
        await newUser.save();
        return newUser.toObject();
      } else {
        createErrorLog(
          `${this.i18nService.t('user.User_already_exists')}`,
          'createUser',
          {
            userId: userData._id,
          },
        );
        throw new Error(this.i18nService.t('user.USER_EXISTS'));
      }
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.ERROR_CREATE_USER')}`,
        'createUser',
        {
          userId: userData?._id,
          error: error?.message,
        },
      );
      throwErrorMessage(error);
    }
  }

  async getUserById(userId: Types.ObjectId) {
    try {
      const user = await this.userModel
        .findById(userId, { password: 0 })
        .lean();
      if (!user) throw new Error(this.i18nService.t('user.USER_NOT_AVAILABLE'));
      return user;
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.USER_NOT_AVAILABLE')}`,
        'getUserById',
        {
          userId,
          error: error?.message,
        },
      );
      throw error;
    }
  }

  async refreshSession(refreshToken: string) {
    try {
      const result = this.tokenService.validateToken(refreshToken);
      // give payload, give secret key
      const payload = {
        userId: result.userId,
        email: result.email,
        role: result.role,
        firstName: result.firstName,
        lastName: result.lastName,
        picture: result.picture,
      };
      return this.tokenService.generateAuthToken(payload);
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.REFRESH_TOKEN_GEN_FALILED')}`,
        'createUser',
        {
          refreshToken: refreshToken,
        },
      );
      throw error;
    }
  }

  async verifyUser(token: string) {
    try {
      // const decodedToken = await this.jwtService.verify(token, { secret: process.env.AUTH_SECRET_KEY! });
      const decodedToken = await this.tokenService.validateToken(token);
      const email = decodedToken.email;
      const user = this.userModel
        .findOne({
          email,
        })
        .select(['-password'])
        .lean();
      if (!user)
        throw new NotFoundException(this.i18nService.t('user.NOT_FOUND'));
      return user;
    } catch (error) {
      throw new UnauthorizedException(
        this.i18nService.t('default.GUARD_TOKEN_INVALID'),
      );
    }
  }

  async updateUser(
    userId: Types.ObjectId,
    updateUserData: UpdateQuery<UserDocument>,
  ) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, updateUserData, { new: true })
        .lean();
      if (!user)
        throw new NotFoundException(this.i18nService.t('user.USER_NOT_FOUND'));

      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(getUserDto: GetUserDto) {
    const { page = 1, limit = 5 } = getUserDto;

    delete getUserDto.limit;
    delete getUserDto.page;
    const sortByDate = getUserDto.sortByDate;
    delete getUserDto.sortByDate;
    const filterQuery: FilterQuery<UserDocument> = getUserDto;
    const sortQuery: any = sortByDate
      ? { createdAt: sortByDate === SortType.ASCENDING ? 1 : -1 }
      : { createdAt: -1 };
    const count = await this.userModel.find(filterQuery).countDocuments();
    const users = await this.userModel.aggregate([
      {
        $match: filterQuery,
      },
      {
        $project: {
          // Exclude the password field from user documents
          password: 0,
        },
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit as any),
      },
    ]);
    return {
      users,
      totalCount: count,
    };
  }

  async googleLogin(googleUser: any) {
    try {
      // Check if user exists with this Google ID
      let user = await this.userModel
        .findOne({ googleId: googleUser.googleId })
        .populate('roles');

      // If no user found with googleId, check by email
      if (!user) {
        user = await this.userModel
          .findOne({ email: googleUser.email })
          .populate('roles');

        // If user exists with email but no googleId, link the Google account
        if (user) {
          user.googleId = googleUser.googleId;
          user.picture = googleUser.picture;
          await user.save();
        }
      }

      // If user still doesn't exist, create a new one
      if (!user) {
        const newUser = new this.userModel({
          googleId: googleUser.googleId,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          userName: googleUser.email.split('@')[0], // Generate username from email
          picture: googleUser.picture,
          roles: [],
        });
        user = await newUser.save();
        await user.populate('roles');
      }

      // Generate tokens
      const payload = {
        userId: user._id,
        email: user.email,
        userName: user.userName,
        role: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      };
      const { accessToken, refreshToken } =
        this.tokenService.generateAuthToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      createErrorLog(`Error in Google login`, 'googleLogin', {
        email: googleUser.email,
        error: error.message,
      });
      throwErrorMessage(error);
    }
  }

  async googleTokenLogin(idToken: string) {
    try {
      // Verify the Google ID token
      const response = await firstValueFrom(
        this.httpService.get(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
        ),
      );

      const googleUser = response.data;

      // Verify the token is for your app
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      if (googleUser.aud !== clientId) {
        throw new UnauthorizedException('Invalid token audience');
      }

      // Extract user information
      const userData = {
        googleId: googleUser.sub,
        email: googleUser.email,
        firstName: googleUser.given_name || '',
        lastName: googleUser.family_name || '',
        picture: googleUser.picture || '',
      };

      // Use the existing googleLogin method
      return this.googleLogin(userData);
    } catch (error) {
      createErrorLog(`Error in Google token login`, 'googleTokenLogin', {
        error: error.message,
      });
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
