import api from '../api';

beforeEach(api.debug.clear);

describe('/task details', () => {
  it.todo('gets the details for a task');

  it.todo('fails for invalid tokens');

  it.todo('fails for invalid task IDs');

  it.todo('fails for tasks the user cannot see');
});
