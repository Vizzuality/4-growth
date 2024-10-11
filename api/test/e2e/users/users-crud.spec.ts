import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/dto/users/user.entity';
import { createUser } from '@shared/lib/entity-mocks';

describe('Users CRUD (e2e)', () => {
  let testManager: TestManager<any>;
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    await testManager.clearDatabase();

    const { jwtToken, user } = await testManager.setUpTestUser();
    authToken = jwtToken;
    testUser = user;
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('should get all users', async () => {
    const createdUsers: User[] = [];
    for (const n of Array(3).keys()) {
      createdUsers.push(
        await createUser(testManager.getDataSource(), {
          email: `user${n}@mail.com`,
        }),
      );
    }
    const response = await testManager
      .request()
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(4); // + 1 for the test user
    expect(response.body.data).toEqual(
      expect.arrayContaining(
        createdUsers.map((user) =>
          expect.objectContaining({ id: user.id, email: user.email }),
        ),
      ),
    );
  });
  it('should get a user by its ID', async () => {
    const user = await createUser(testManager.getDataSource(), {
      email: 'user@email.com',
    });
    const response = await testManager
      .request()
      .get('/users/' + user.id)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(user.id);
    expect(response.body.email).toEqual(user.email);
  });
  it('should update a user', async () => {
    const user = await createUser(testManager.getDataSource(), {
      email: 'user@test.com',
    });

    const { jwtToken } = await testManager.logUserIn(user);
    const updatedUser = { email: 'new@mail.com' };
    const response = await testManager
      .request()
      .patch('/users/' + user.id)
      .send(updatedUser)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(201);
    expect(response.body.data.email).toEqual(updatedUser.email);

    // Previous token should work after updating the user's email
    const userMeResponse = await testManager
      .request()
      .get('/users/me')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(userMeResponse.status).toBe(200);
    expect(userMeResponse.body.data.email).toEqual(updatedUser.email);
  });
});
