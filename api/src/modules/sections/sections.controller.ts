import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { sectionContract as c } from '@shared/contracts/sections.contract';
import { ControllerResponse } from '@api/types/controller.type';
import { SectionsService } from '@api/modules/sections/sections.service';
import { Public } from '@api/decorators/is-public.decorator';

@Controller()
export class SectionsController {
  public constructor(private readonly sectionsService: SectionsService) {}

  @Public()
  @TsRestHandler(c.searchSections)
  public async searchSections(): Promise<ControllerResponse> {
    return tsRestHandler(c.searchSections, async ({ query }) => {
      const { data, metadata } =
        await this.sectionsService.findAllPaginated(query);
      const mockedData = addRandomDataToWidgets(data);
      return { body: { data: mockedData, metadata }, status: 200 };
    });
  }
}

/**
 * @description temporal hack to add random data to widgets until we get access to the real data, or progress with filters
 */

function addRandomDataToWidgets(sections) {
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomLabel = () => {
    const labels = [
      'Value 1',
      'Value 2',
      'Value 3',
      'Value 4',
      'Value 5',
      null,
    ];
    return labels[randomInt(0, labels.length - 1)];
  };

  const generateRandomDataObject = () => ({
    value: randomInt(1, 1000),
    total: randomInt(1000, 5000),
    label: randomLabel(),
  });

  sections.forEach((section) => {
    section.baseWidgets.forEach((widget) => {
      const dataCount = randomInt(2, 5);

      widget.data = Array.from({ length: dataCount }, generateRandomDataObject);
    });
  });

  return sections;
}
