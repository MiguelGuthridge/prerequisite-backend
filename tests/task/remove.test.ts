import { TaskDeletionStrategy, TaskId } from '../../src/types/task';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/task remove', () => {
  it('removes tasks', async () => {
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

  describe('removal strategies', () => {
    describe('cascade', () => {
      it('removes all tasks that depend on it', async () => {
        const { token } = await makeUser();
        const { id: projectId } = await makeProject(token);
        const { id: taskId1 } = await makeTask(token, projectId);
        const { id: taskId2 } = await makeTask(
          token,
          projectId,
          {
            num: 2,
            prerequisites: [taskId1],
          }
        );

        // Delete task 1 with cascade strategy
        await expect(
          api.task.remove(token, taskId1, TaskDeletionStrategy.Cascade)
        ).resolves.toStrictEqual(
          {}
        );

        // Task 2 should also be deleted
        await expect(
          api.task.details(token, taskId2)
        ).rejects.toMatchObject({
          code: 400,
        });
      });
    });

    describe('reroute', () => {
      it('updates prerequisites for direct dependents', async () => {
        const { token } = await makeUser();
        const { id: projectId } = await makeProject(token);
        const { id: taskId1 } = await makeTask(token, projectId);
        const { id: taskId2 } = await makeTask(
          token,
          projectId,
          {
            num: 2,
            prerequisites: [taskId1],
          }
        );
        const { id: taskId3 } = await makeTask(
          token,
          projectId,
          {
            num: 3,
            prerequisites: [taskId2],
          }
        );

        // Delete task 2 with reroute strategy
        await expect(
          api.task.remove(token, taskId2, TaskDeletionStrategy.Cascade)
        ).resolves.toStrictEqual(
          {}
        );

        // Task 3 should now have task 1 as a prerequisite
        await expect(
          api.task.details(token, taskId3)
        ).resolves.toMatchObject({
          prerequisites: [taskId1],
        });
      });
    });

    describe('trim', () => {
      it('removes task as a prerequisite for all direct dependents', async () => {
        const { token } = await makeUser();
        const { id: projectId } = await makeProject(token);
        const { id: taskId1 } = await makeTask(token, projectId);
        const { id: taskId2 } = await makeTask(
          token,
          projectId,
          {
            num: 2,
            prerequisites: [taskId1],
          }
        );

        // Delete task 1 with trim strategy
        await expect(
          api.task.remove(token, taskId1, TaskDeletionStrategy.Trim)
        ).resolves.toStrictEqual(
          {}
        );

        // Task 2 should have no more prerequisites
        await expect(
          api.task.details(token, taskId2)
        ).resolves.toMatchObject({
          prerequisites: [],
        });
      });
    });

    it('fails for non-existent strategies', async () => {
      const { token } = await makeUser();
      const { id: projectId } = await makeProject(token);
      const { id: taskId } = await makeTask(token, projectId);

      await expect(
        // Yucky hack
        api.task.remove(token, taskId, -1 as unknown as TaskDeletionStrategy)
      ).rejects.toMatchObject(
        { code: 400 }
      );
    });
  });
});
