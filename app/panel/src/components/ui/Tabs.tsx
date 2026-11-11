import { useState } from 'react'
import type { ReactNode } from 'react'

export interface TabOption {
  id: string
  label: string
  count?: number
}

export interface TabNavProps {
  tabs: TabOption[]
  activeId: string
  onChange: (id: string) => void
}

export function TabNav({ tabs, activeId, onChange }: TabNavProps) {
  return (
    <nav
      className='flex flex-wrap items-end gap-0 border-b border-border'
      role='tablist'
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId

        return (
          <button
            key={tab.id}
            type='button'
            role='tab'
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:border-border-strong hover:text-surface-text'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' ? (
              <span
                className={`border px-1.5 py-px text-[10px] leading-none ${
                  isActive
                    ? 'border-primary/30 bg-primary-soft text-primary'
                    : 'border-border bg-secondary-soft text-text-muted'
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

export interface TabsProps {
  tabs: TabOption[]
  value: string
  onChange: (id: string) => void
  children?: ReactNode
}

export function Tabs({ tabs, value, onChange, children }: TabsProps) {
  return (
    <div>
      <TabNav
        tabs={tabs}
        activeId={value}
        onChange={onChange}
      />
      <div
        role='tabpanel'
        className='pt-4'
      >
        {children}
      </div>
    </div>
  )
}

export interface UncontrolledTabsProps {
  tabs: TabOption[]
  defaultValue?: string
  children?: (activeId: string) => ReactNode
}

export function UncontrolledTabs({
  tabs,
  defaultValue,
  children,
}: UncontrolledTabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.id ?? '')

  return (
    <Tabs
      tabs={tabs}
      value={active}
      onChange={setActive}
    >
      {children?.(active)}
    </Tabs>
  )
}
