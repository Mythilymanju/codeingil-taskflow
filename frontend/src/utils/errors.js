export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response) {
    return 'Cannot reach the server. Check your connection and that the API is running.'
  }
  const { status, data } = error.response
  if (status === 401) return 'Your session has expired. Please log in again.'
  if (status === 403 || status === 404) return 'You do not have access to this item, or it no longer exists.'
  if (status === 419) return 'Your session expired. Refresh the page and try again.'
  if (status === 422) return data?.message || 'Please correct the highlighted fields.'
  if (status === 429) return 'Too many attempts. Please wait a minute and try again.'
  if (status >= 500) return 'The server had a problem. Please try again shortly.'
  return data?.message || fallback
}

export function getFieldErrors(error) {
  return error?.response?.status === 422 ? error.response.data?.errors ?? {} : {}
}