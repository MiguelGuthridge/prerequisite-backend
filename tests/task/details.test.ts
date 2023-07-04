import { TaskId } from '../../src/types/task';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeTask, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/task details', () => {
  it('gets the details for a task', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    const { id: taskId } = await api.task.create(
      token,
      projectId,
      'my task',
      '',
      false,
      [],
    );

    // Details should be correct
    await expect(api.task.details(token, taskId)).resolves.toStrictEqual({
      id: taskId,
      name: 'my task',
      description: '',
      complete: false,
      prerequisites: [],
      project: projectId,
    });
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    await expect(api.task.details('bad' as Token, taskId)).rejects.toMatchObject({
      code: 401,
    });
  });

  it('fails for invalid task IDs', async () => {
    const { token } = await makeUser();
    await expect(api.task.details(token, 'bad' as TaskId)).rejects.toMatchObject({
      code: 400,
    });
  });

  it('fails for tasks the user cannot see', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);
    const { id: taskId } = await makeTask(token, projectId);

    const { token: token2 } = await makeUser(2);
    await expect(api.task.details(token2, taskId)).rejects.toMatchObject({
      code: 403,
    });
  });
});
