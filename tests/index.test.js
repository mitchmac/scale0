const scale0 = require('../src/index');

test('Error with missing event property', () => {
  const args = {docRoot: '/'}
  expect(async () => await scale0.validate(args)).rejects.toThrow();
});


test('Error with empty event property', () => {
  const args = {event: '', docRoot: '/'}
  expect(async () => await scale0.validate(args)).rejects.toThrow();
});

test('Error with missing docRoot', () => {
  const args = {event: 'test'}
  expect(async () => await scale0.validate(args)).rejects.toThrow();
});

test('Error with invalid docRoot property', () => {
  const args = {event: {}, docRoot: '/invalid'}
  expect(async () => await scale0.validate(args)).rejects.toThrow();
});

test('Error with invalid routerScript property', () => {
  const args = {event: {}, docRoot: '/', routerScript: '/invalid'}
  expect(async () => await scale0.validate(args)).rejects.toThrow();
});