import React from 'react'
import { useSettingsStore }       from '../stores/settingsStore.js'
import { SettingsSidebar }        from '../components/settings/SettingsSidebar.jsx'
import { ProfileSection }         from '../components/settings/ProfileSection.jsx'
import { CompanySection }         from '../components/settings/CompanySection.jsx'
import { NotificationsSection }   from '../components/settings/NotificationsSection.jsx'
import { AppearanceSection }      from '../components/settings/AppearanceSection.jsx'
import { SecuritySection }        from '../components/settings/SecuritySection.jsx'
import { PreferencesSection }     from '../components/settings/PreferencesSection.jsx'

const SECTION_COMPONENTS = {
  profile:       ProfileSection,
  company:       CompanySection,
  notifications: NotificationsSection,
  appearance:    AppearanceSection,
  security:      SecuritySection,
  preferences:   PreferencesSection,
}

export function SettingsPage() {
  const { activeSection, setActiveSection } = useSettingsStore()
  const ActiveComponent = SECTION_COMPONENTS[activeSection] || ProfileSection

  return (
    <div className="max-w-[1100px]">
      {/* Mobile section selector */}
      <div className="sm:hidden mb-4">
        <select
          className="input-base"
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
        >
          {Object.keys(SECTION_COMPONENTS).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left sidebar nav — hidden on mobile */}
        <div className="hidden sm:block w-48 flex-shrink-0 sticky top-6">
          <div className="card p-2">
            <SettingsSidebar />
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 min-w-0">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
