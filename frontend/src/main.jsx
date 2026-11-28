import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'

const root = document.getElementById('root')
const app = <React.StrictMode><App /></React.StrictMode>

// Pages are prerendered to HTML at build time; hydrate when that HTML is present.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
