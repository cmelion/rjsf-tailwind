// In src/main.tsx
import { worker } from "@/mocks/browser"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { BrowserRouter as Router } from "react-router-dom"

const alwaysDev = true

async function bootstrap() {
  await worker.start({
    serviceWorker: {
      // Ensure this matches your Vite base, e.g. '/rjsf-tailwind/'
      url: import.meta.env.BASE_URL + "mockServiceWorker.js",
    },
    onUnhandledRequest: "bypass",
  })

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Router basename={import.meta.env.BASE_URL}>
        <App />
      </Router>
    </React.StrictMode>,
  )
}

bootstrap()
