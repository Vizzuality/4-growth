import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/modules/auth/auth.module';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { CustomWidgetService } from '@api/modules/widgets/custom-widgets.service';
import { CustomWidgetsController } from '@api/modules/widgets/custom-widgets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseWidget, CustomWidget]),
    forwardRef(() => AuthModule),
  ],
  providers: [CustomWidgetService],
  controllers: [CustomWidgetsController],
})
export class WidgetsModule {}
