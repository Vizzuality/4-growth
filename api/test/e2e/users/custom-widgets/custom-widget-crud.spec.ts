import { DataSourceManager } from '@api/infrastructure/data-source-manager';
import { User } from '@shared/dto/users/user.entity';
import { BaseWidget } from '@shared/dto/widgets/base-widget.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { TestManager } from 'api/test/utils/test-manager';

describe('Custom Widgets API', () => {
  const VALID_UUID = '3e933b93-79e5-4f98-b687-64405834cefd';

  let testManager: TestManager<unknown>;
  let dataSourceManager: DataSourceManager;
  let entityMocks: ReturnType<typeof testManager.mocks>;
  let authToken: string;
  let testUser: User;

  let baseWidget: BaseWidget;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    dataSourceManager = testManager.testApp.get(DataSourceManager);
    entityMocks = testManager.mocks();
  });

  beforeEach(async () => {
    await testManager.clearDatabase();

    const user = await testManager.setUpTestUser();
    authToken = user.jwtToken;
    testUser = user.user;

    await dataSourceManager.loadQuestionIndicatorMap();
    baseWidget = await entityMocks.createBaseWidget({
      indicator: 'location-country-region',
    });
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Create API', () => {
    it("Shouldn't allow anonymous users to create custom widgets", async () => {
      // Given
      const requestBody = {
        name: 'My saved widget',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: baseWidget.defaultVisualization,
      };

      // When
      const res = await testManager
        .request()
        .post(`/users/${testUser.id}/widgets`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(401);
      expect(res.body.errors).toBeDefined();
    });

    it('Should allow authenticated users to create custom widgets for themselves when they provide valid params', async () => {
      // Given
      const requestBody = {
        name: 'My saved widget',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: baseWidget.defaultVisualization,
        filters: [],
      };

      // When
      const res = await testManager
        .request()
        .post(`/users/${testUser.id}/widgets`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(201);
      const returnedData = res.body.data;
      expect(returnedData.name).toBe(requestBody.name);
      expect(returnedData.widget.indicator).toBe(requestBody.widgetIndicator);
      expect(returnedData.user.id).toBe(testUser.id);
      expect(returnedData.filters).toEqual(requestBody.filters);
    });

    it("Shouldn't allow authenticated users to create custom widgets for themselves when they provide invalid params", async () => {
      // Given
      const requestBody = {
        name: 'My saved widget',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: '1',
        filters: [],
      };

      // When
      const res = await testManager
        .request()
        .post(`/users/${VALID_UUID}/widgets`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(403);
      expect(res.body.errors).toBeDefined();
    });

    it("Shouldn't allow authenticated users to create custom widgets for other users even if they provide valid params", async () => {
      // Given
      const requestBody = {
        name: 'My saved widget',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: 'invalid_visualization',
        filters: [],
      };

      // When
      const res = await testManager
        .request()
        .post(`/users/${testUser.id}/widgets`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Read API', () => {
    it('Should allow authenticated users to read their custom widgets', async () => {
      // Given
      await entityMocks.createCustomWidget({
        name: 'custom-widget1',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      await entityMocks.createCustomWidget({
        name: 'custom-widget2',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(`/users/${testUser.id}/widgets`)
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(200);
    });

    it('Should allow authenticated users to read their custom widgets', async () => {
      // Given
      const userCustomWidgets = [
        await entityMocks.createCustomWidget({
          name: 'custom-widget1',
          user: { id: testUser.id },
          widget: { indicator: baseWidget.indicator },
        }),
        await entityMocks.createCustomWidget({
          name: 'custom-widget2',
          user: { id: testUser.id },
          widget: { indicator: baseWidget.indicator },
        }),
      ];

      // Other user's custom widgets
      const { user: otherUser } = await testManager.setUpTestUser({
        email: '2@test.com',
      });
      await entityMocks.createCustomWidget({
        name: 'other-user-custom-widget1',
        user: { id: otherUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(`/users/${testUser.id}/widgets`)
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(200);
      const returnedData = res.body.data;
      expect(returnedData).toHaveLength(2);
      for (const userCustomWidget of userCustomWidgets) {
        const foundWidget = returnedData.find(
          (r) => r.name === userCustomWidget.name,
        );
        expect(foundWidget).toBeDefined();
      }
    });

    // TODO: Skipping this tests as filtering capabilities are not working, pending to fix the corresponding schema
    it('Should allow authenticated users to read their custom widgets using filters', async () => {
      // Given
      const customWidget1 = await entityMocks.createCustomWidget({
        name: 'custom-widget1',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      await entityMocks.createCustomWidget({
        name: 'custom-widget2',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // Other user's custom widgets
      const { user: otherUser } = await testManager.setUpTestUser({
        email: '2@test.com',
      });
      await entityMocks.createCustomWidget({
        name: 'other-user-custom-widget1',
        user: { id: otherUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(
          `/users/${testUser.id}/widgets?filter[name]=${customWidget1.name}&include[]=widget`,
        )
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(200);
      const responseData = res.body.data;
      expect(responseData).toHaveLength(1);
      expect(responseData[0].name).toBe(customWidget1.name);
      expect(responseData[0].widget.indicator).toBe(baseWidget.indicator);
    });

    it("Shouldn't allow authenticated users to read other user's custom widgets", async () => {
      // Given
      await entityMocks.createCustomWidget({
        name: 'custom-widget1',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      await entityMocks.createCustomWidget({
        name: 'custom-widget2',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // Other user's custom widgets
      const { user: otherUser } = await testManager.setUpTestUser({
        email: '2@test.com',
      });
      await entityMocks.createCustomWidget({
        name: 'other-user-custom-widget1',
        user: { id: otherUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(`/users/${VALID_UUID}/widgets`)
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(403);
      expect(res.body.errors).toBeDefined();
    });

    it("Shouldn't allow authenticated users to read other user's custom widgets by id", async () => {
      // Given
      // Other user's custom widgets
      const { user: otherUser } = await testManager.setUpTestUser({
        email: '2@test.com',
      });
      const createdCustomWidget = await entityMocks.createCustomWidget({
        name: 'other-user-custom-widget1',
        user: { id: otherUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(`/users/${otherUser.id}/widgets/${createdCustomWidget.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(403);
      expect(res.body.errors).toBeDefined();
    });

    it("Shouldn't allow anonymous users to read other user's custom widgets", async () => {
      // Given
      // Other user's custom widgets
      const { user: otherUser } = await testManager.setUpTestUser({
        email: '2@test.com',
      });
      await entityMocks.createCustomWidget({
        name: 'other-user-custom-widget1',
        user: { id: otherUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(`/users/${otherUser.id}/widgets`);

      // Then
      expect(res.status).toBe(401);
      expect(res.body.errors).toBeDefined();
    });

    it("Shouldn't allow anonymous users to read other user's custom widgets by id", async () => {
      // Given
      // Other user's custom widgets
      const { user: otherUser } = await testManager.setUpTestUser({
        email: '2@test.com',
      });
      const createdCustomWidget = await entityMocks.createCustomWidget({
        name: 'other-user-custom-widget1',
        user: { id: otherUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .get(`/users/${otherUser.id}/widgets/${createdCustomWidget.id}`);

      // Then
      expect(res.status).toBe(401);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Update API', () => {
    it("Shouldn't allow anonymous users to update custom widgets", async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      const requestBody = {
        name: 'Name changed!',
        widgetIndicator: baseWidget.indicator,
      };

      // When
      const res = await testManager
        .request()
        .patch(`/users/${testUser.id}/widgets/${customWidget.id}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(401);
      expect(res.body.errors).toBeDefined();
    });

    it("Shouldn't allow authenticated users to update their custom widgets when they provide invalid params", async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      const requestBody = {
        name: 'Name changed!',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: '1',
        filters: [],
      };

      // When
      const res = await testManager
        .request()
        .patch(`/users/${testUser.id}/widgets/${customWidget.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('Should allow authenticated users to update their custom widgets when they provide valid params', async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      const requestBody = {
        name: 'Name changed!',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: baseWidget.defaultVisualization,
        filters: [],
      };

      // When
      const res = await testManager
        .request()
        .patch(`/users/${testUser.id}/widgets/${customWidget.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(200);
      const returnedData = res.body.data;
      expect(returnedData.name).toBe(requestBody.name);
      expect(returnedData.widget).toEqual({
        indicator: requestBody.widgetIndicator,
      });
      expect(returnedData.defaultVisualization).toBe(
        requestBody.defaultVisualization,
      );
    });

    it("Shouldn't allow authenticated users to update other user's custom widgets even if they provide valid params", async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });
      const requestBody = {
        name: 'Name changed!',
        widgetIndicator: baseWidget.indicator,
        defaultVisualization: baseWidget.defaultVisualization,
        filters: [],
      };

      // When
      const res = await testManager
        .request()
        .patch(`/users/${VALID_UUID}/widgets/${customWidget.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestBody);

      // Then
      expect(res.status).toBe(403);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Delete API', () => {
    it("Shouldn't allow anonymous users to delete custom widgets", async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .delete(`/users/${testUser.id}/widgets/${customWidget.id}`);

      // Then
      expect(res.status).toBe(401);
      expect(res.body.errors).toBeDefined();
    });

    it('Should allow authenticated users to delete their custom widgets', async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .delete(`/users/${testUser.id}/widgets/${customWidget.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(204);
      const customWidgetRepository = testManager
        .getDataSource()
        .getRepository(CustomWidget);

      expect(
        await customWidgetRepository.findOneBy({
          id: customWidget.id,
          user: { id: customWidget.user.id },
        }),
      ).toBe(null);
    });

    it("Shouldn't allow authenticated users to delete other user's custom widgets", async () => {
      // Given
      const customWidget = await entityMocks.createCustomWidget({
        name: 'custom-widget',
        user: { id: testUser.id },
        widget: { indicator: baseWidget.indicator },
      });

      // When
      const res = await testManager
        .request()
        .delete(`/users/${VALID_UUID}/widgets/${customWidget.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Then
      expect(res.status).toBe(403);
      expect(res.body.errors).toBeDefined();
    });
  });
});
