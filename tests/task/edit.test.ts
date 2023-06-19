import api from '../api';

beforeEach(api.debug.clear);

describe('/task edit', () => {
  it.todo('edits tasks');

  it.todo('fails for users without project access');

  it.todo('fails for invalid tokens');

  it.todo('fails for invalid task IDs');

  it.todo('fails when setting task name to be empty');
});
