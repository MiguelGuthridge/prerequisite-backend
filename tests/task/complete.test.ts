import { TaskId } from '../../src/types/task';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('task completion', () => {
  it('marks tasks as complete', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(api.task.complete(token, taskId, true)).resolves.toStrictEqual({});

    await expect(api.task.details(token, taskId)).resolves.toMatchObject({
      complete: true,
    });
  });

  it('marks tasks as incomplete', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(api.task.complete(token, taskId, false)).resolves.toStrictEqual({});

    await expect(api.task.details(token, taskId)).resolves.toMatchObject({
      complete: false,
    });
  });

  it('fails to complete if there are incomplete prerequisites', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId1 } = await makeTask(token, projectId);
    const { id: taskId2 } = await makeTask(
      token,
      projectId,
      { num: 2, prerequisites: [taskId1] },
    );

    await expect(api.task.complete(token, taskId2, true)).rejects.toMatchObject({
      code: 400,
    });
  });

  it('fails to un-complete if there are complete post-requisites', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId1 } = await makeTask(token, projectId);
    const { id: taskId2 } = await makeTask(
      token,
      projectId,
      { num: 2, prerequisites: [taskId1] },
    );

    await api.task.complete(token, taskId1, true);
    await api.task.complete(token, taskId2, true);

    await expect(api.task.complete(token, taskId1, false)).rejects.toMatchObject({
      code: 400,
    });
  });

  it('fails for for users without project access', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    const { token: token2 } = await makeUser(2);
    await expect(
      api.task.complete(token2, taskId, true)
    ).rejects.toMatchObject(
      { code: 403 }
    );
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.complete('bad' as Token, taskId, true)
    ).rejects.toMatchObject(
      { code: 401 }
    );
  });

  it('fails for invalid task IDs', async () => {
    const { token } = await makeUser();
    await expect(
      api.task.complete(token, 'bad' as TaskId, true)
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });
});
