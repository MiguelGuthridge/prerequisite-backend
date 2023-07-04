import { TaskId } from '../../src/types/task';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/task edit', () => {
  it('edits tasks', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.edit(token, taskId, 'new name', 'new description', true, [])
    ).resolves.toStrictEqual(
      {}
    );

    await expect(api.task.details(token, taskId)).resolves.toStrictEqual({
      id: taskId,
      name: 'new name',
      description: 'new description',
      complete: true,
      prerequisites: [],
      project: projectId,
    });
  });

  it('fails for users without project access', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    const { token: token2 } = await makeUser(2);
    await expect(
      api.task.edit(token2, taskId, 'hi', '', true, [])
    ).rejects.toMatchObject(
      { code: 403 }
    );
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.edit('bad' as Token, taskId, 'hi', '', true, [])
    ).rejects.toMatchObject(
      { code: 401 }
    );
  });

  it('fails for invalid task IDs', async () => {
    const { token } = await makeUser();
    await expect(
      api.task.edit(token, 'bad' as TaskId, 'hi', '', true, [])
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });

  it('fails when setting task name to be empty', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.edit(token, taskId, '', 'new description', true, [])
    ).rejects.toMatchObject(
      { code: 400 }
    );
  });

  describe('prerequisites', () => {
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
      await expect(api.task.edit(
        token,
        taskId1,
        'my task',
        '',
        false,
        []
      )).rejects.toMatchObject(
        { code: 400 }
      );
    });

    it('allows prerequisites to be defined', async () => {
      // todo
    });

    it('fails for invalid task IDs in prerequisites', async () => {
      // todo
    });

    it('fails for task IDs outside of the project', async () => {
      // todo
    });
  });
});
