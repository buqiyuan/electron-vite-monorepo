import { app, dialog } from 'electron'

globalThis.__dirname ||= import.meta.dirname

// Expose the dev build version when running unpackaged so logs stay accurate.
if (!app.isPackaged) {
  app.getVersion = () => import.meta.env.VITE_APP_VERSION
}
// (Not recommended) Disable TLS verification (used only when debugging corporate proxies)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Prevent the native error dialog from interrupting the UI
dialog.showErrorBox = function (title, content) {
  // Log the failure instead of surfacing a blocking dialog
  console.error(`Error logged without system dialog: ${title}\n${content}`)
}

// Capture uncaught exceptions so we can log them centrally
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
})

// Capture unhandled promise rejections for the same reason
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason)
})

// Let Sentry manage crashReporter manually when it is wired up

// Quick helper for locally testing crash reporting
// setTimeout(() => {
//   process.crash()
// }, 6000)
