import './Header.css'

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo-seal">CF</div>
          <div className="header-title-group">
            <span className="header-title">CodeFixer AI</span>
            <span className="header-subtitle">Asystent Debugowania Kodu</span>
          </div>
        </div>
        <div className="header-meta">
          <span className="header-badge">NBP × JSystems</span>
        </div>
      </div>
    </header>
  )
}
