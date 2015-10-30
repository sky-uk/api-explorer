import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

export default () => {
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  return createDevTools(
    <DockMonitor toggleVisibilityKey='H'
                 changePositionKey='Q'>
      <LogMonitor />
    </DockMonitor>
  )
}
