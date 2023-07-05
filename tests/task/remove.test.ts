import { TaskDeletionStrategy, TaskId } from '../../src/types/task';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/task remove', () => {
  it('deletes tasks', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.remove(token, taskId, TaskDeletionStrategy.Cascade)
    ).resolves.toStrictEqual(
      {}
    );

    // Make sure the task was removed from the project
    await expect(
      api.project.details(token, projectId)
    ).resolves.toMatchObject({
      tasks: [],
    });
  });

  it('fails for invalid task ids', async () => {
    const { token } = await makeUser();
    await expect(
      api.task.remove(token, 'bad' as TaskId, TaskDeletionStrategy.Cascade)
    ).rejects.toMatchObject({
      code: 400,
    });
  });

  it('fails for users without ownership of the project', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    const { token: token2 } = await makeUser(2);
    await expect(
      api.task.remove(token2, taskId, TaskDeletionStrategy.Cascade)
    ).rejects.toMatchObject({
      code: 403,
    });
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(
      api.task.remove('bad' as Token, taskId, TaskDeletionStrategy.Cascade)
    ).rejects.toMatchObject({
      code: 401,
    });
  });

  describe('deletion strategies', () => {
    describe('cascade', () => {
      it.todo('deletes all tasks that depend on it');
    });

    describe('reroute', () => {
      it.todo('updates prerequisites for direct dependents');
    });

    describe('trim', () => {
      it.todo('removes task as a prerequisite for all direct dependents');
    });

    it.todo('fails for non-existent strategies');
  });
});
