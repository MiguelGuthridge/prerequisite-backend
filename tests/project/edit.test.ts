import { ProjectId } from '../../src/types/project';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/project edit', () => {
  it('successfully edits the properties of a project', async () => {
    const { token, id: userId } = await makeUser();
    const { id: projectId } = await makeProject(token);
    await api.project.edit(token, projectId, 'Edited', 'Project');
    const details = await api.project.details(token, projectId);
    expect(details).toStrictEqual({
      id: projectId,
      owner: userId,
      name: 'Edited',
      description: 'Project',
    });
  });

  it("doesn't let users who don't own the project edit it", async () => {
    const { token: token1, id: userId } = await makeUser();
    const { token: token2 } = await makeUser(2);
    const { id: projectId } = await api.project.create(token1, 'Proj', 'A');
    await expect(
      api.project.edit(token2, projectId, 'Edited', 'B')
    ).rejects.toMatchObject({ code: 403 });

    // Make sure it didn't change
    const details = await api.project.details(token1, projectId);
    expect(details).toStrictEqual({
      id: projectId,
      owner: userId,
      name: 'Proj',
      description: 'A',
    });
  });

  it('fails for invalid project IDs', async () => {
    const { token } = await makeUser();
    await expect(
      api.project.edit(token, 'bad' as ProjectId, 'Bad', 'Project')
    ).rejects.toMatchObject({ code: 400 });
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    await expect(
      api.project.edit('bad' as Token, projectId, 'Bad', 'Token')
    ).rejects.toMatchObject({ code: 401 });
  });
});
