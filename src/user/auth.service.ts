import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from './entity/user.entity';
import { throwErrorMessage } from '../common/utils/throwErrorMessage';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { GetUserDto } from './dto/get-user.dto';
import { SortType } from 'src/common/enum/sort.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from '../application/application.service';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly i18nService: I18nService,
    private readonly tokenService: TokenService,
    private readonly authService: PasswordService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly applicationService: ApplicationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async loginWithEmailAndPassword(loginUserDto: LoginUserDto) {
    try {
      const { emailOrUserName, password, appId } = loginUserDto;
      
      let filterQuery: any = {};
      if (emailOrUserName.includes('@')) {
        filterQuery.email = emailOrUserName;
      } else {
        filterQuery.userName = emailOrUserName;
      }

      if (appId) {
        filterQuery.appId = appId;
      } else {
        // To handle global app specific / admin users
        filterQuery.appId = IsNull();
      }



      const user = await this.userRepository.findOne({
        where: filterQuery,
        relations: { roles: true },
      });

      if (!user) {
        throw new NotFoundException(this.i18nService.t('user.USER_NOT_AVAILABLE'));
      }

      const isEqual = await this.authService.comparePasswords(password, user.password);
      if (!isEqual) {
        throw new ForbiddenException(this.i18nService.t('user.Invalid_pin'));
      }

      const payload = {
        userId: user.id,
        email: user.email,
        userName: user.userName,
        role: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        appId: appId || user.appId,
      };

      const { accessToken, refreshToken } = await this.tokenService.generateAuthToken(payload);
      
      // Store session in Redis
      await this.cacheManager.set(`session:${accessToken}`, payload, 60 * 60 * 24 * 7); // 7 days

      return { accessToken, refreshToken };
    } catch (error) {
      throwErrorMessage(error);
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: userData.email, appId: userData.appId ? userData.appId : IsNull() },
      });

      if (userExists) {
        throw new Error(this.i18nService.t('user.USER_EXISTS'));
      }

      let password = userData.password;
      if (password) {
        password = await this.authService.createPasswordHash(password);
      }

      const newUser = this.userRepository.create({
        ...userData,
        password,
      });

      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throwErrorMessage(error);
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new Error(this.i18nService.t('user.USER_NOT_AVAILABLE'));
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async refreshSession(refreshToken: string) {
    try {
      const result = await this.tokenService.validateToken(refreshToken);
      const payload = {
        userId: result['userId'],
        email: result['email'],
        role: result['role'],
        firstName: result['firstName'],
        lastName: result['lastName'],
        picture: result['picture'],
        appId: result['appId'],
      };
      const tokens = await this.tokenService.generateAuthToken(payload);
      await this.cacheManager.set(`session:${tokens.accessToken}`, payload, 60 * 60 * 24 * 7);
      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(token: string) {
    try {
      // First check Redis Cache for session
      const cachedSession = await this.cacheManager.get(`session:${token}`);
      if (!cachedSession) {
         throw new UnauthorizedException('Session expired or invalid');
      }

      const decodedToken = await this.tokenService.validateToken(token);
      const user = await this.userRepository.findOne({
        where: { email: decodedToken.email, appId: decodedToken.appId ? decodedToken.appId : IsNull() },
      });

      if (!user) throw new NotFoundException(this.i18nService.t('user.NOT_FOUND'));
      delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException(this.i18nService.t('default.GUARD_TOKEN_INVALID'));
    }
  }

  async updateUser(userId: string, updateUserData: any) {
    try {
      await this.userRepository.update(userId, updateUserData);
      const user = await this.getUserById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(getUserDto: GetUserDto) {
    const { page = 1, limit = 5 } = getUserDto;
    // Basic TypeORM implementation for getUsers
    const skip = (Number(page) - 1) * Number(limit);
    
    const [users, totalCount] = await this.userRepository.findAndCount({
      skip,
      take: Number(limit),
      order: {
        createDate: 'DESC'
      }
    });

    users.forEach(u => delete u.password);

    return {
      users,
      totalCount,
    };
  }

  async googleLogin(googleUser: any, appId?: string) {
    try {
      let user = await this.userRepository.findOne({ 
        where: { googleId: googleUser.googleId, appId: appId ? appId : IsNull() },
        relations: { roles: true }
      });

      if (!user) {
        user = await this.userRepository.findOne({ 
          where: { email: googleUser.email, appId: appId ? appId : IsNull() },
          relations: { roles: true }
        });

        if (user) {
          user.googleId = googleUser.googleId;
          user.picture = googleUser.picture;
          await this.userRepository.save(user);
        }
      }

      if (!user) {
        user = this.userRepository.create({
          googleId: googleUser.googleId,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          userName: googleUser.email.split('@')[0],
          picture: googleUser.picture,
        });
        await this.userRepository.save(user);
      }

      const payload = {
        userId: user.id,
        email: user.email,
        userName: user.userName,
        role: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      };

      const { accessToken, refreshToken } = await this.tokenService.generateAuthToken(payload);
      await this.cacheManager.set(`session:${accessToken}`, payload, 60 * 60 * 24 * 7);

      return { accessToken, refreshToken };
    } catch (error) {
      throwErrorMessage(error);
    }
  }

  async googleTokenLogin(idToken: string, appId?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`),
      );

      const googleUser = response.data;
      
      let clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      
      if (appId) {
        const app = await this.applicationService.getApplicationByAppId(appId);
        if (app.googleClientId) {
          clientId = app.googleClientId;
        }
      }

      if (googleUser.aud !== clientId) {
        throw new UnauthorizedException('Invalid token audience');
      }

      const userData = {
        googleId: googleUser.sub,
        email: googleUser.email,
        firstName: googleUser.given_name || '',
        lastName: googleUser.family_name || '',
        picture: googleUser.picture || '',
      };

      return this.googleLogin(userData, appId);
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
