import React from 'react'
import { createRoot } from 'react-dom/client'
import { VisitsPanel, ActivityFeed, Snoozable } from '../../src/components/admin/DashboardIslands'
import { sampleDays, sampleActivity } from './sample'

// Mounts the interactive parts on their own so a browser test can click them without a server.
createRoot(document.getElementById('root')!).render(
  <div className="edif-dash">
    <ul className="edif-att" style={{ listStyle: 'none' }}><Snoozable id="test:row"><a href="#row">A tender closing soon</a></Snoozable></ul>
    <VisitsPanel days={sampleDays()} />
    <ActivityFeed items={sampleActivity()} href="#log" />
  </div>,
)
