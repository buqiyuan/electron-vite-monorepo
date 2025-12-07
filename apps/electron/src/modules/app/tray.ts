import { app, Menu, Tray } from 'electron'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { getMainWindow } from '/@/modules/app/mainWindow'

let tray: Tray
/** Create or refresh the tray */
export async function createTray() {
  await setTimeout()
  // Reuse the existing tray instance if it is already there
  if (tray) {
    tray.setContextMenu(createContextMenu())
    return tray
  }

  const iconPath = path.join(import.meta.dirname, '..', 'resources/tray.png')
  // Construct the tray icon
  tray = new Tray(iconPath)
  // Set the tooltip text
  tray.setToolTip(app.getName())

  // Load the tray menu
  tray.setContextMenu(createContextMenu())
  // Show the main window on click
  tray.on('click', () => {
    getMainWindow()?.show()
    getMainWindow()?.setSkipTaskbar(false)
  })
  return tray
}

/** Build the tray menu */
function createContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'show',
      click: () => {
        getMainWindow()?.show()
      },
    },
    {
      label: 'exit',
      click: () => {
        tray.destroy()
        getMainWindow()?.destroy()
      },
    },
  ])
}

export function getTray() {
  return tray
}
