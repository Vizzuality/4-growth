import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppBaseService } from '@api/utils/app-base.service';
import { AppInfoDTO } from '@api/utils/info.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Section,
  SectionWithDataWidget,
} from '@shared/dto/sections/section.entity';
import { FetchSpecification } from 'nestjs-base-service';
import { ISurveyDataRepository } from '@api/infrastructure/survey-data-repository.interface';
import { WidgetDataFiltersSchema } from '@shared/schemas/widget-data-filters.schema';

@Injectable()
export class SectionsService extends AppBaseService<
  SectionWithDataWidget,
  unknown,
  unknown,
  AppInfoDTO
> {
  public constructor(
    @InjectRepository(Section)
    private readonly sectionsRepository: Repository<SectionWithDataWidget>,
    @Inject('SurveyDataRepository')
    private readonly surveyDataRepository: ISurveyDataRepository,
  ) {
    super(sectionsRepository, 'section', 'sections');
  }

  // The library should make this method protected
  public async extendFindAllQuery(
    query: SelectQueryBuilder<SectionWithDataWidget>,
  ): Promise<SelectQueryBuilder<SectionWithDataWidget>> {
    query
      .leftJoinAndSelect('section.baseWidgets', 'baseWidget')
      .orderBy('section.order', 'ASC') // Sort sections by order
      .addOrderBy('baseWidget.sectionOrder', 'ASC'); // Sort baseWidgets by sectionOrder

    return query;
  }

  public async extendFindAllResults(
    entitiesAndCount: [SectionWithDataWidget[], number],
    fetchSpecification?: FetchSpecification & WidgetDataFiltersSchema,
    // info?: AppInfoDTO,
  ): Promise<[SectionWithDataWidget[], number]> {
    const [sections, count] = entitiesAndCount;
    const { filters } = fetchSpecification;

    const sectionsWithData =
      await this.surveyDataRepository.addSurveyDataToSections(
        sections,
        filters,
      );

    return [sectionsWithData, count];
  }
}
