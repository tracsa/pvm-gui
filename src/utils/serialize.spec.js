import serialize from './serialize';

describe('Serialize', function() {
  it('should work with multiple params', function() {
    const data = serialize({
      a: 1,
      b: 2,
    });

    expect(data).toEqual('a=1&b=2')
  });
});
