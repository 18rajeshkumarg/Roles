import { useEffect, useState } from 'react'
import { clearSession, fetchDashboard, fetchModule, getAdminUrl, getStoredUser, login, setSession } from './api'

const navigation = [
  { label: 'Overview', icon: '◈' },
  { label: 'People', icon: '◎' },
  { label: 'Departments', icon: '▦' },
  { label: 'Roles', icon: '✦' },
  { label: 'Attendance', icon: '◷' },
  { label: 'Payroll', icon: '▤' },
  { label: 'Admin Panel', icon: '⚙' },
]

const metrics = [
  { label: 'Active people', value: '248', change: '+12.4%', tone: 'green' },
  { label: 'Open roles', value: '18', change: '+4 this month', tone: 'orange' },
  { label: 'Attendance today', value: '94.8%', change: '+2.1%', tone: 'blue' },
]

function App() {
  const [user, setUser] = useState(getStoredUser())
  const [activePage, setActivePage] = useState('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) return <Login onLogin={setUser} />

  function signOut() {
    clearSession()
    setUser(null)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><span>R</span><div><strong>Roles</strong><small>Organization workspace</small></div></div>
        <div className="workspace-switcher"><span className="workspace-dot" /> My Workspace <span className="chevron">⌄</span></div>
        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navigation.map((item) => (
            <button className={`nav-item ${activePage === item.label ? 'active' : ''}`} key={item.label} onClick={() => setActivePage(item.label)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><span className="status-dot" /> Systems operational <span>↗</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">{activePage}</span><h1>{activePage === 'Overview' ? `Good morning, ${user.first_name || user.username}` : activePage}</h1></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="notification" aria-label="Notifications">♢<span /></button><button className="avatar" onClick={() => setMenuOpen(!menuOpen)}>{(user.first_name?.[0] || user.username?.[0] || 'U')}{user.last_name?.[0] || ''}</button>{menuOpen && <div className="profile-menu"><strong>{user.first_name} {user.last_name}</strong><span>{user.email}</span><button onClick={signOut}>Sign out</button></div>}</div>
        </header>

        {activePage === 'Overview' ? <Overview /> : activePage === 'Admin Panel' ? <AdminPanel user={user} /> : <Placeholder page={activePage} />}
      </main>
    </div>
  )
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login(username, password)
      setSession(data)
      onLogin(data.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <main className="login-page"><div className="login-art"><span className="eyebrow light">Organisation Management</span><h1>Build a workplace that knows where it is going.</h1><p>People, roles, departments, and momentum in one considered workspace.</p></div><form className="login-card" onSubmit={submit}><div className="brand-mark login-brand"><span>R</span><div><strong>Roles</strong><small>Organisation Management</small></div></div><span className="eyebrow">Welcome back</span><h2>Sign in to your workspace</h2><label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label><label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button submit-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button><small className="login-note">Sign in with your Organisation Management account.</small></form></main>
}

function Overview() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { fetchDashboard().then(setData).catch((requestError) => setError(requestError.message)) }, [])
  const stats = data?.stats
  const metrics = stats ? [{ label: 'Total people', value: stats.total_employees, change: `${stats.active_employees} active`, tone: 'green' }, { label: 'Departments', value: stats.total_departments, change: 'Across organization', tone: 'blue' }, { label: 'Roles', value: stats.total_roles, change: 'Defined positions', tone: 'orange' }] : metricsFallback
  return <section className="page-body">
    <div className="welcome-band"><div><span className="eyebrow light">Organisation Management</span><h2>Your organisation at a glance.</h2><p>Live data from the Organisation Management backend.</p></div><button className="primary-button">+ Add person</button></div>
    {error && <div className="api-warning">{error}</div>}
    <div className="metric-grid">{metrics.map((metric) => <article className={`metric-card ${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.change}</small></article>)}</div>
    <div className="content-grid"><article className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">People overview</span><h3>Team growth</h3></div><button className="select-button">Last 6 months⌄</button></div><div className="chart"><div className="chart-line" /><div className="chart-labels"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div></div></article><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Organisation</span><h3>By department</h3></div><button className="more-button">•••</button></div><div className="department-list">{data?.departments?.length ? data.departments.map((department) => <Department key={department.id} name={department.name} count={department.employee_count} width={`${Math.min(100, department.employee_count * 2)}%`} color="green" />) : <p className="muted empty-list">No departments returned.</p>}</div></article></div>
    <div className="section-heading"><div><span className="eyebrow">Keep moving</span><h3>Recent employees</h3></div></div><div className="activity-list">{data?.recent_employees?.length ? data.recent_employees.map((employee) => { const name = employee.name || employee.full_name || 'Employee'; return <Activity key={employee.id} initials={name.slice(0, 2).toUpperCase()} name={name} action={`${employee.role || employee.role_title || 'Team member'} · ${employee.department || employee.department_name || 'Organization'}`} time={employee.date_joined || ''} /> }) : <p className="muted empty-list">No recent employee data returned.</p>}</div>
  </section>
}

const metricsFallback = [
  { label: 'Total people', value: '—', change: 'Waiting for API', tone: 'green' },
  { label: 'Departments', value: '—', change: 'Waiting for API', tone: 'blue' },
  { label: 'Roles', value: '—', change: 'Waiting for API', tone: 'orange' },
]

function Department({ name, count, width, color }) { return <div className="department"><div><span>{name}</span><strong>{count}</strong></div><div className="progress"><i className={color} style={{ width }} /></div></div> }
function Activity({ initials, name, action, time }) { return <div className="activity"><div className="activity-avatar">{initials}</div><div><strong>{name}</strong><span>{action}</span></div><time>{time}</time></div> }
function Placeholder({ page }) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { setResult(null); setError(''); fetchModule(page).then(setResult).catch((requestError) => setError(requestError.message)) }, [page])
  const rows = Array.isArray(result) ? result : result?.results || []
  return <section className="page-body"><div className="module-heading"><div><span className="eyebrow">Organisation Management</span><h2>{page}</h2><p>Manage live records from the Organisation Management backend.</p></div><button className="primary-button">+ Add record</button></div>{error && <div className="api-warning">{error}</div>}<div className="data-table">{rows.length ? rows.map((row) => <div className="data-row" key={row.id}><strong>{row.full_name || row.title || row.name || row.employee_id || row.id}</strong><span>{row.email || row.department_name || row.display_level || row.status || 'Record'}</span><span>{row.role_title || row.code || row.date || row.amount || ''}</span></div>) : <p className="muted empty-list">No records returned yet.</p>}</div></section>
}

function AdminPanel({ user }) {
  return <section className="page-body"><div className="module-heading"><div><span className="eyebrow">Organisation Management</span><h2>Admin Panel</h2><p>Open the complete backend administration system for users, roles, departments, employees, payroll, and settings.</p></div><span className="admin-badge">{user.user_type || 'ADMIN'}</span></div><div className="admin-grid"><article className="panel"><span className="eyebrow">Backend Admin</span><h3>Complete administration</h3><p className="admin-value">{user.first_name} {user.last_name}</p><p className="muted">Use the complete Django administration interface.</p><button className="primary-button" onClick={() => { window.location.href = getAdminUrl() }}>Open Admin Panel</button></article><article className="panel"><span className="eyebrow">Services</span><h3>Connected system</h3><p className="admin-value">React + Django</p><p className="muted">The React application uses the project's real API and database.</p></article></div></section>
}

export default App
