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
import { WidgetDataFiltersSchema } from '@shared/schemas/widget-data-filters.schema';
import {
  ISurveyAnswerRepository,
  SurveyAnswerRepository,
} from '@api/infrastructure/survey-answer-repository.interface';

@Injectable()
export class SectionsService extends AppBaseService<
  Section,
  unknown,
  unknown,
  AppInfoDTO
> {
  public constructor(
    @InjectRepository(Section)
    private readonly sectionsRepository: Repository<SectionWithDataWidget>,
    @Inject(SurveyAnswerRepository)
    private readonly surveyAnswerRepository: ISurveyAnswerRepository,
  ) {
    super(sectionsRepository, 'section', 'sections');
  }

  public async searchSectionsWithData(
    query: FetchSpecification & WidgetDataFiltersSchema,
  ): Promise<SectionWithDataWidget[]> {
    // TODO: There is a bug / weird behavior in typeorm when using take and skip with leftJoinAndSelect:
    //       https://github.com/typeorm/typeorm/issues/4742#issuecomment-780702477
    //       Since we don't need pagination for this endpoint, we can disable it for now but worth checking
    query.disablePagination = true;
    const [sections] = await this.findAll(query);

    const { filters } = query;

    const sectionsWithData =
      await this.surveyAnswerRepository.addSurveyDataToSections(
        sections,
        filters,
      );

    return sectionsWithData;
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
}
