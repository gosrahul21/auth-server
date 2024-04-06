import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from './role.entity';
import { UserStatus } from 'src/common/enum/user-status.enum';

@Schema()
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true, index: true })
  userName?: string;

  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: true, index: true })
  email?: string;

  @Prop({ required: true })
  password?: string;

  @Prop({
    type: Array<Types.ObjectId>,
    ref: Role.name,
  })
  roles: Types.ObjectId[];

  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status?: UserStatus;

  @Prop({ default: Date.now })
  createDate?: string;
}

export type UserDocument = Document & User;

export const UserSchema = SchemaFactory.createForClass(User);
