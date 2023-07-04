import { TaskId } from '../../src/types/task';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('edit task prerequisites', () => {
  it('allows prerequisites to be defined', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId1 } = await makeTask(token, projectId);
    const { id: taskId2 } = await makeTask(token, projectId, { num: 2 });

    await expect(
      api.task.prerequisites(token, taskId1, [taskId2])
    ).resolves.toStrictEqual({});

    await expect(api.task.details(token, taskId1)).resolves.toMatchObject({
      prerequisites: [taskId2]
    });
  });

  it("doesn't allow self-dependencies", async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.prerequisites(token, taskId, [taskId])
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });

  it("doesn't allow circular dependencies of tasks", async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId1 } = await makeTask(token, projectId);
    const { id: taskId2 } = await makeTask(
      token,
      projectId,
      { num: 2, prerequisites: [taskId1] },
    );

    // Can't make second a dependency of first
    await expect(api.task.prerequisites(
      token,
      taskId1,
      [taskId2]
    )).rejects.toMatchObject(
      { code: 400 }
    );
  });

  it('fails for invalid task IDs in prerequisites', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.prerequisites(token, taskId, ['bad' as TaskId])
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });

  it('fails for task IDs outside of the project as prerequisites', async () => {
    const { token } = await makeUser();
    const { id: projectId1 } = await makeProject(token);
    const { id: taskId1 } = await makeTask(token, projectId1);
    const { id: projectId2 } = await makeProject(token);
    const { id: taskId2 } = await makeTask(token, projectId2);

    await expect(
      api.task.prerequisites(token, taskId1, [taskId2])
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });

  it('fails for users without project access', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    const { token: token2 } = await makeUser(2);
    await expect(
      api.task.prerequisites(token2, taskId, [])
    ).rejects.toMatchObject(
      { code: 403 }
    );
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.prerequisites('bad' as Token, taskId, [])
    ).rejects.toMatchObject(
      { code: 401 }
    );
  });

  it('fails for invalid task IDs', async () => {
    const { token } = await makeUser();
    await expect(
      api.task.prerequisites(token, 'bad' as TaskId, [])
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });
});
