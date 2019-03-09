import { TrustCssPipe } from './trust-css.pipe';

describe('TrustCssPipe', () => {
  it('create an instance', () => {
    const pipe = new TrustCssPipe();
    expect(pipe).toBeTruthy();
  });
});
