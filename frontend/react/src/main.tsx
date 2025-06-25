import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App /> {/*Wraping our app inside of a browser router to enable page routing capabilites */}
  </BrowserRouter>
)
