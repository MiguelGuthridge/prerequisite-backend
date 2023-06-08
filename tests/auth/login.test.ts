import api from '../api';

beforeEach(api.debug.clear);

describe('/auth/login', () => {
  it('allows users with valid credentials to log in', async () => {
    const register = await api.auth.register('myusername', 'Display Name', 'abc123ABC!');

    // Now log them in
    const login = await api.auth.login('myusername', 'abc123ABC!');
    expect(login.id).toStrictEqual(register.id);
    expect(login.token).not.toStrictEqual(register.token);
  });

  describe('error cases', () => {
    it('fails to login with incorrect password', async () => {
      await api.auth.register('myusername', 'Display Name', 'abc123ABC!');
      await expect(
        api.auth.login('myusername', 'wrong password')
      ).rejects.toMatchObject({ code: 400 });
    });

    it('fails to login with incorrect username', async () => {
      await expect(
        api.auth.login('myusername', 'abc123ABC!')
      ).rejects.toMatchObject({ code: 400 });
    });
  });
});
