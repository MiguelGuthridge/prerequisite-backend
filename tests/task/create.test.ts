import { ProjectId } from '../../src/types/project';
import { Token } from '../../src/types/user';
import api from '../api';
import { makeProject, makeUser } from '../helpers';

beforeEach(api.debug.clear);

describe('/task create', () => {
  it('allows users to create tasks', async () => {
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

    expect(taskId).toBeString();

    // It should exist
    await expect(api.task.details(token, taskId)).toResolve();
  });

  it('fails for invalid tokens', async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    await expect(api.task.create(
      'not.a.token' as Token,
      projectId,
      'my task',
      '',
      false,
      [],
    )).rejects.toMatchObject({ code: 401 });
  });

  it('fails for invalid project IDs', async () => {
    const { token } = await makeUser();

    await expect(api.task.create(
      token,
      'not a project' as ProjectId,
      'my task',
      '',
      false,
      [],
    )).rejects.toMatchObject({ code: 400 });
  });

  it("fails if the user doesn't have access to the project", async () => {
    const { token: token1 } = await makeUser();
    const { id: projectId } = await makeProject(token1);
    const { token: token2 } = await makeUser(2);

    await expect(api.task.create(
      token2,
      projectId,
      'my task',
      '',
      false,
      [],
    )).rejects.toMatchObject({ code: 403 });
  });

  it("doesn't allow empty task names", async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    await expect(api.task.create(
      token,
      projectId,
      '',
      'description',
      false,
      [],
    )).rejects.toMatchObject({ code: 400 });
  });

  it("doesn't allow whitespace-only task names", async () => {
    const { token } = await makeUser();
    const { id: projectId } = await makeProject(token);

    await expect(api.task.create(
      token,
      projectId,
      ' \t\n',
      'description',
      false,
      [],
    )).rejects.toMatchObject({ code: 400 });
  });

  describe('prerequisite management', () => {
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
