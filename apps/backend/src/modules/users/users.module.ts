import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { EmailModule } from '../../infrastructure/email/email.module';
import { Study } from '../studies/entities/study.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerificationToken, Study]),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
