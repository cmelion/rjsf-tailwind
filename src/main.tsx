import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import { BrowserRouter as Router } from "react-router-dom"
const alwaysDev = true;
// Create an async bootstrap function to set up MSW
async function bootstrap() {
  // Only initialize MSW in development mode
  // if (process.env.NODE_ENV === 'development') {
  if (alwaysDev) {
    // Dynamically import the MSW browser module
    const { worker } = await import('./mocks/browser')
    // Start the worker with configuration
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
    console.log('MSW initialized')
  }
  // Render the React app after MSW is ready (if applicable)
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  )
}

// Call the bootstrap function to start the app
bootstrap()
