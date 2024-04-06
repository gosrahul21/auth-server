import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: Date.now })
  createDate: string;
}

export type RoleDocument = Document & Role;

export const RoleSchema = SchemaFactory.createForClass(Role);
