import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/project list', () => {
  it('lists all projects available to the user', async () => {
    const { token, id: userId } = await makeUser();
    const { id: projectId1 } = await api.project.create(
      token,
      'My project 1',
      'A test project',
    );
    const { id: projectId2 } = await api.project.create(
      token,
      'My project 2',
      'A test project',
    );
    const { projects } = await api.project.list(token);
    expect(projects).toIncludeAllMembers([
      {
        id: projectId1,
        name: 'My project 1',
        description: 'A test project',
        owner: userId,
      },
      {
        id: projectId2,
        name: 'My project 2',
        description: 'A test project',
        owner: userId,
      },
    ]);
  });

  it("doesn't list projects for other users", async () => {
    const { token: token1 } = await makeUser();
    const { token: token2 } = await makeUser(2);
    await makeProject(token1);
    const { projects } = await api.project.list(token2);
    expect(projects).toBeEmpty();
  });

  it('errors on invalid token', async () => {
    expect(
      api.project.list('bad' as Token)
    ).rejects.toMatchObject({ code: 401 });
  });
});
