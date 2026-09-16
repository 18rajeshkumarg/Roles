const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export function getAccessToken() {
  return localStorage.getItem('roles_access_token')
}

export function getStoredUser() {
  const value = localStorage.getItem('roles_user')
  return value ? JSON.parse(value) : null
}

export function setSession(data) {
  localStorage.setItem('roles_access_token', data.access)
  localStorage.setItem('roles_refresh_token', data.refresh)
  localStorage.setItem('roles_user', JSON.stringify(data.user))
}

export function clearSession() {
  localStorage.removeItem('roles_access_token')
  localStorage.removeItem('roles_refresh_token')
  localStorage.removeItem('roles_user')
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.detail || body.message || 'The request could not be completed.')
  return body
}

export function login(username, password) {
  return request('/accounts/login/', { method: 'POST', body: JSON.stringify({ username, password }) })
}

export function fetchDashboard() {
  return request('/dashboard/api/')
}

export function fetchModule(module) {
  const paths = {
    People: '/employees/',
    Departments: '/departments/',
    Roles: '/roles/',
    Attendance: '/employees/attention/',
    Payroll: '/employees/payrolls/',
  }
  return request(paths[module])
}
