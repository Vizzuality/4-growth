import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '@shared/dto/sections/section.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SectionsService extends AppBaseService<
  Section,
  unknown,
  unknown,
  AppInfoDTO
> {
  public constructor(
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {
    super(sectionsRepository, 'section', 'sections');
  }

  // Does not allow me to use protected
  public async extendFindAllQuery(
    query: SelectQueryBuilder<Section>,
  ): Promise<SelectQueryBuilder<Section>> {
    query
      .leftJoinAndSelect('section.baseWidgets', 'baseWidget')
      .orderBy('section.order', 'ASC') // Sort sections by order
      .addOrderBy('baseWidget.sectionOrder', 'ASC'); // Sort baseWidgets by sectionOrder

    return query;
  }
}
