import api from '../api';

beforeEach(api.debug.clear);

describe('/auth/register', () => {
  it('allows users to register', async () => {
    const { id, token } = await api.auth.register('myusername', 'Display Name', 'abc123ABC!');
    expect(id).toBeDefined();
    expect(token).toBeDefined();
  });

  describe('error cases', () => {
    it('fails to register users with weak passwords', async () => {
      await expect(
        api.auth.register('myusername', 'Display Name', 'abc123')
      ).rejects.toMatchObject({ code: 400 });
    });

    it('fails to register users with duplicate usernames', async () => {
      await api.auth.register('myusername', 'Display Name', 'abc123ABC!');
      await expect(
        api.auth.register('myusername', 'Other Name', 'abc123ABC!')
      ).rejects.toMatchObject({ code: 400 });
    });

    it.each([
      { username: 'User', explanation: 'Capital letters' },
      { username: 'user!', explanation: 'Punctuation' },
      { username: 'my username', explanation: 'whitespace' },
    ])(
      'fails to register users with bad usernames ($explanation)',
      async ({ username }) => {
        await expect(
          api.auth.register(username, 'Other Name', 'abc123ABC!')
        ).rejects.toMatchObject({ code: 400 });
      });
  });
});
