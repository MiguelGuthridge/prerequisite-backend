import api from '../api';

beforeEach(api.debug.clear);

describe('/task remove', () => {
  it.todo('deletes tasks');

  it.todo('fails for invalid task ids');

  it.todo('fails for users without ownership of the project');

  it.todo('fails for invalid tokens');

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
