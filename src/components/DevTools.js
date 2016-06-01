import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

export default () => {
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  return createDevTools(
    <DockMonitor toggleVisibilityKey='ctrl-h'
                 changePositionKey='ctrl-q'
                 defaultSize={0.2}
                 defaultIsVisible >
      <LogMonitor />
    </DockMonitor>
  )
}
