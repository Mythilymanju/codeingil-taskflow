import { getErrorMessage, getFieldErrors } from './errors'

test('network failure is explained', () => {
  expect(getErrorMessage({})).toMatch(/cannot reach the server/i)
})

test('status codes map to friendly messages', () => {
  expect(getErrorMessage({ response: { status: 401, data: {} } })).toMatch(/session has expired/i)
  expect(getErrorMessage({ response: { status: 404, data: {} } })).toMatch(/no longer exists/i)
  expect(getErrorMessage({ response: { status: 500, data: {} } })).toMatch(/server had a problem/i)
})

test('422 field errors are extracted', () => {
  const err = { response: { status: 422, data: { errors: { name: ['Please enter a project name.'] } } } }
  expect(getFieldErrors(err).name[0]).toBe('Please enter a project name.')
})