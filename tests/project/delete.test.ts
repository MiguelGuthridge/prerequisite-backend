import api from '../api';

beforeEach(api.debug.clear);

describe('/project delete', () => {
  it.todo('successfully deletes a project');

  it.todo('deletes all tasks belonging to the project');

  it.todo("fails if the user isn't the project owner");

  it.todo('fails for invalid project IDs');

  it.todo('fails for invalid tokens');
});
