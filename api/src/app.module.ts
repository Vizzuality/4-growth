import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '@api/app.service';
import { UsersModule } from '@api/modules/users/users.module';
import { User } from '@shared/dto/users/user.entity';

// TODO: The dist folder structure changes if some shared lib is imported in the api. Check this

const user: User = new User();

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
