import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/project remove', () => {
  it('successfully deletes a project', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    await api.project.remove(token, projectId);

    await expect(api.project.details(token, projectId))
      .rejects.toMatchObject({ code: 400 });
  });

  it('deletes all tasks belonging to the project', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await api.project.remove(token, projectId);

    await expect(api.task.details(token, taskId))
      .rejects.toMatchObject({ code: 400 });
  });

  it("fails if the user isn't the project owner", async () => {
    const { token: token1 } = await makeUser();
    const { id: projectId } = await makeProject(token1);
    const { token: token2 } = await makeUser(2);

    await expect(api.project.remove(token2, projectId))
      .rejects.toMatchObject({ code: 403 });
  });

  it('fails for invalid project IDs', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    await api.project.remove(token, projectId);

    // Project already removed
    await expect(api.project.remove(token, projectId))
      .rejects.toMatchObject({ code: 400 });
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    await expect(api.project.remove('not.a.token' as Token, projectId))
      .rejects.toMatchObject({ code: 401 });
  });
});
