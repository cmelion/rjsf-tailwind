// In src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import { BrowserRouter as Router } from "react-router-dom"
const alwaysDev = true;

async function bootstrap() {
  if (alwaysDev) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
    console.log('MSW initialized')
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Router basename={import.meta.env.BASE_URL}>
        <App />
      </Router>
    </React.StrictMode>
  )
}

bootstrap()