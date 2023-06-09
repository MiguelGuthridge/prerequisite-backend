import api from './api';

describe('/debug/echo', () => {
  it('echoes the given content', async () => {
    const data = await api.debug.echo('hello');
    // INVESTIGATE: Why does .toStrictEqual not work here?
    expect(data).toStrictEqual({ value: 'hello' });
  });
});
