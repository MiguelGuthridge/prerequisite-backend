import api from './api';

describe('/debug/echo', () => {
  it('echoes the given content', async () => {
    const data = await api.debug.echo('hello');
    expect(data).toStrictEqual({ value: 'hello' });
  });
});
