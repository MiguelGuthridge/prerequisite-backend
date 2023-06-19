import api from '../api';

beforeEach(api.debug.clear);

describe('/task create', () => {
  it.todo('allows users to create tasks');

  it.todo('fails for invalid tokens');

  it.todo('fails for invalid project IDs');

  it.todo("fails if the user doesn't have access to the project");

  it.todo("doesn't allow empty task names");

  it.todo("doesn't allow whitespace-only task names");
});
