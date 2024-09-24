import { TestManager } from '../utils/test-manager';
import { Repository } from 'typeorm';
import { AuthService } from '@api/modules/auth/auth.service';
import { ApiEventEntity } from '@shared/dto/api-events/api-events.entity';
import { API_EVENT_TYPES } from '@shared/dto/api-events/api-event.types';
import { UsersService } from '@api/modules/users/users.service';

describe('Api Events', () => {
  let testManager: TestManager<any>;
  let authService: AuthService;
  let usersService: UsersService;
  let apiEventsRepository: Repository<ApiEventEntity>;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager({ logger: false });
    authService = testManager.moduleFixture.get<AuthService>(AuthService);
    usersService = testManager.moduleFixture.get<UsersService>(UsersService);
    apiEventsRepository = testManager.dataSource.getRepository(ApiEventEntity);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('an api event should be registered if a user has requested password recovery but the provided email is not found in the system', async () => {
    await authService.recoverPassword({ email: 'not-existing-user@test.com' });
    const apiEvent = await apiEventsRepository.findOne({
      where: { type: API_EVENT_TYPES.USER_NOT_FOUND_FOR_PASSWORD_RECOVERY },
    });

    expect(apiEvent).toBeDefined();
    expect(apiEvent.data.email).toEqual('not-existing-user@test.com');
  });
  it('an api event should be registered if a user has requested password recovery successfully', async () => {
    const user = await testManager
      .mocks()
      .createUser({ email: 'recovery@email.com' });
    await authService.recoverPassword({ email: user.email });
    const apiEvent = await apiEventsRepository.findOne({
      where: { type: API_EVENT_TYPES.USER_REQUESTED_PASSWORD_RECOVERY },
    });
    expect(apiEvent).toBeDefined();
    expect(apiEvent.associatedId).toEqual(user.id);
  });
  it('an api event should be registered when a user signs up', async () => {
    await authService.signUp({ email: 'test@mail.com', password: '12345678' });
    const apiEvent = await apiEventsRepository.findOne({
      where: { type: API_EVENT_TYPES.USER_SIGNED_UP },
    });
    expect(apiEvent).toBeDefined();
  });
  it('an api event should be registered when a user recovers password', async () => {
    const user = await testManager
      .mocks()
      .createUser({ email: 'test@test.com' });
    await usersService.resetPassword(user, 'new-password');
    const apiEvent = await apiEventsRepository.findOne({
      where: { type: API_EVENT_TYPES.USER_RECOVERED_PASSWORD },
    });
    expect(apiEvent).toBeDefined();
    expect(apiEvent.associatedId).toEqual(user.id);
  });
});
