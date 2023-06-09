import { ProjectId } from '../../src/types/project';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/project/details', () => {
  it('gets the details of existing projects', async () => {
    const { token, id: userId } = await makeUser();
    const { id: projectId } = await api.project.create(
      token,
      'My project',
      'A test project',
    );

    const details = await api.project.details(token, projectId);

    expect(details).toStrictEqual({
      id: projectId,
      name: 'My project',
      description: 'A test project',
      owner: userId,
    });
    // TODO: List of tasks in the project
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id } = await api.project.create(
      token,
      'My project',
      'A test project',
    );
    await expect(
      api.project.details('bad' as Token, id)
    ).rejects.toMatchObject({ code: 401 });
    // TODO: Is 401 the right code here?
  });

  it('fails for invalid project IDs', async () => {
    const { token } = await makeUser();
    await expect(
      api.project.details(token, 'bad' as ProjectId)
    ).rejects.toMatchObject({ code: 400 });
  });

  it('fails for projects the user did not create', async () => {
    const { token: token1 } = await makeUser();
    const { token: token2 } = await makeUser(2);
    const { id } = await api.project.create(
      token1,
      'My project',
      'A test project',
    );
    // Call with the other token
    await expect(
      api.project.details(token2, id)
    ).rejects.toMatchObject({ code: 403 });
  });
});
