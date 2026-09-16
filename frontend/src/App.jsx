import { useState } from 'react'

const navigation = [
  { label: 'Overview', icon: '◈' },
  { label: 'People', icon: '◎' },
  { label: 'Departments', icon: '▦' },
  { label: 'Roles', icon: '✦' },
  { label: 'Attendance', icon: '◷' },
  { label: 'Payroll', icon: '▤' },
]

const metrics = [
  { label: 'Active people', value: '248', change: '+12.4%', tone: 'green' },
  { label: 'Open roles', value: '18', change: '+4 this month', tone: 'orange' },
  { label: 'Attendance today', value: '94.8%', change: '+2.1%', tone: 'blue' },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

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
          <div><span className="eyebrow">{activePage}</span><h1>{activePage === 'Overview' ? 'Good morning, Rajesh' : activePage}</h1></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="notification" aria-label="Notifications">♢<span /></button><button className="avatar" onClick={() => setMenuOpen(!menuOpen)}>RK</button>{menuOpen && <div className="profile-menu"><strong>Rajesh Kumar</strong><span>Administrator</span><button>Sign out</button></div>}</div>
        </header>

        {activePage === 'Overview' ? <Overview /> : <Placeholder page={activePage} />}
      </main>
    </div>
  )
}

function Overview() {
  return <section className="page-body">
    <div className="welcome-band"><div><span className="eyebrow light">Tuesday, September 16, 2026</span><h2>Your organization at a glance.</h2><p>Make confident decisions with a clear view of your people, roles, and momentum.</p></div><button className="primary-button">+ Add person</button></div>
    <div className="metric-grid">{metrics.map((metric) => <article className={`metric-card ${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.change}</small></article>)}</div>
    <div className="content-grid"><article className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">People overview</span><h3>Team growth</h3></div><button className="select-button">Last 6 months⌄</button></div><div className="chart"><div className="chart-line" /><div className="chart-labels"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div></div></article><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Organization</span><h3>By department</h3></div><button className="more-button">•••</button></div><div className="department-list"><Department name="Engineering" count="86" width="86%" color="green" /><Department name="Product & Design" count="42" width="58%" color="orange" /><Department name="Operations" count="38" width="49%" color="blue" /><Department name="People & Finance" count="27" width="34%" color="red" /></div></article></div>
    <div className="section-heading"><div><span className="eyebrow">Keep moving</span><h3>Recent activity</h3></div><button className="text-button">View all →</button></div><div className="activity-list"><Activity initials="AM" name="Aisha Menon" action="joined Engineering as Senior Product Designer" time="12 min ago" /><Activity initials="JP" name="Jon Park" action="completed the onboarding checklist" time="45 min ago" /><Activity initials="SN" name="Sofia Nair" action="submitted a leave request for Oct 4" time="2 hr ago" /></div>
  </section>
}

function Department({ name, count, width, color }) { return <div className="department"><div><span>{name}</span><strong>{count}</strong></div><div className="progress"><i className={color} style={{ width }} /></div></div> }
function Activity({ initials, name, action, time }) { return <div className="activity"><div className="activity-avatar">{initials}</div><div><strong>{name}</strong><span>{action}</span></div><time>{time}</time></div> }
function Placeholder({ page }) { return <section className="page-body"><div className="empty-state"><span className="empty-icon">✦</span><span className="eyebrow">Workspace module</span><h2>{page} is ready for API data</h2><p>This React surface is connected to the existing Django project structure. The next step is wiring this module to its REST endpoint.</p><button className="primary-button">Connect module</button></div></section> }

export default App
