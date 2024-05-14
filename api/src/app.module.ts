import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '@api/app.service';
import { UsersModule } from '@api/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
