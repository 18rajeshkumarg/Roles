const DATA_KEY = 'roles_management_data'
const SESSION_KEY = 'roles_management_session'

const seedData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', first_name: 'System', last_name: 'Administrator', email: 'admin@organisation.local', user_type: 'ADMIN' },
    { id: 2, username: 'eng_mgr', password: 'eng_mgr123', first_name: 'Ryan', last_name: 'Garcia', email: 'eng_mgr@organisation.local', user_type: 'MANAGER' },
    { id: 3, username: 'dev1', password: 'dev1123', first_name: 'Jennifer', last_name: 'King', email: 'dev1@organisation.local', user_type: 'EMPLOYEE' },
  ],
  departments: [{ id: 1, name: 'Engineering', code: 'ENG', employee_count: 86 }, { id: 2, name: 'Product', code: 'PROD', employee_count: 42 }, { id: 3, name: 'Human Resources', code: 'HR', employee_count: 27 }, { id: 4, name: 'Finance', code: 'FIN', employee_count: 18 }],
  roles: [{ id: 1, title: 'CEO', display_level: 'Executive Leadership', department_name: 'Engineering', employee_count: 1 }, { id: 2, title: 'Engineering Manager', display_level: 'Middle Management', department_name: 'Engineering', employee_count: 5 }, { id: 3, title: 'Senior Software Engineer', display_level: 'Senior Professional', department_name: 'Engineering', employee_count: 24 }, { id: 4, title: 'Product Manager', display_level: 'Middle Management', department_name: 'Product', employee_count: 6 }],
  employees: [{ id: 1, employee_id: 'EMP0001', full_name: 'John Smith', email: 'ceo@organisation.local', department_name: 'Engineering', role_title: 'CEO', status: 'ACTIVE' }, { id: 2, employee_id: 'EMP0002', full_name: 'Ryan Garcia', email: 'eng_mgr@organisation.local', department_name: 'Engineering', role_title: 'Engineering Manager', status: 'ACTIVE' }, { id: 3, employee_id: 'EMP0003', full_name: 'Jennifer King', email: 'dev1@organisation.local', department_name: 'Engineering', role_title: 'Software Engineer', status: 'ACTIVE' }],
  attendance: [{ id: 1, employee: 'John Smith', date: '2026-09-17', status: 'PRESENT' }],
  payroll: [{ id: 1, employee: 'John Smith', month: 'September 2026', status: 'PROCESSED', amount: '$8,400' }],
}

function readData() { const value = localStorage.getItem(DATA_KEY); if (!value) localStorage.setItem(DATA_KEY, JSON.stringify(seedData)); return JSON.parse(value || JSON.stringify(seedData)) }
function writeData(data) { localStorage.setItem(DATA_KEY, JSON.stringify(data)); return data }

export function getAccessToken() {
  return localStorage.getItem(SESSION_KEY)
}

export function getStoredUser() {
  const value = localStorage.getItem(SESSION_KEY)
  return value ? JSON.parse(value) : null
}

export function setSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data.user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function login(username, password) {
  const user = readData().users.find((item) => item.username === username && item.password === password)
  if (!user) return Promise.reject(new Error('Invalid username or password.'))
  const { password: _password, ...safeUser } = user
  return Promise.resolve({ access: `session-${user.id}`, refresh: '', user: safeUser })
}

export function fetchDashboard() {
  const data = readData()
  return Promise.resolve({ stats: { total_employees: data.employees.length, active_employees: data.employees.filter((item) => item.status === 'ACTIVE').length, total_departments: data.departments.length, total_roles: data.roles.length }, departments: data.departments, roles_by_level: { 'Executive Leadership': 4, 'Middle Management': 15, 'Senior Professional': 42, 'Junior Professional': 96 }, recent_employees: data.employees })
}

export function fetchModule(module) {
  const paths = { People: 'employees', Departments: 'departments', Roles: 'roles', Attendance: 'attendance', Payroll: 'payroll' }
  return Promise.resolve({ results: readData()[paths[module]] || [] })
}

export function createRecord(module, record) { const data = readData(); const key = { People: 'employees', Departments: 'departments', Roles: 'roles' }[module]; data[key].push({ ...record, id: Date.now() }); writeData(data); return Promise.resolve(record) }

export function deleteRecord(module, id) { const data = readData(); const key = { People: 'employees', Departments: 'departments', Roles: 'roles' }[module]; data[key] = data[key].filter((item) => item.id !== id); writeData(data); return Promise.resolve() }
