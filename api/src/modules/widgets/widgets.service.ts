import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WidgetsService extends AppBaseService<
  BaseWidget,
  unknown,
  unknown,
  AppInfoDTO
> {
  public constructor(
    // It has to be protected in order to correctly extend the class
    protected readonly logger: Logger,
    @InjectRepository(BaseWidget)
    private baseWidgetRepository: Repository<BaseWidget>,
  ) {
    super(baseWidgetRepository, 'base-widget', 'based-widgets');
  }
}
