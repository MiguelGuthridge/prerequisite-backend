import api from '../api';

beforeEach(api.debug.clear);

describe('/auth/register', () => {
  it('allows users to register', async () => {
    const { id, token } = await api.auth.register('myusername', 'Display Name', 'abc123ABC!');
    expect(id).toBeDefined();
    expect(token).toBeDefined();
  });
});
