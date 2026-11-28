import { renderToString } from 'react-dom/server'
import App from './App'
import { PathContext } from './router'

/** Render a route to static HTML at build time */
export function render(path) {
  return renderToString(
    <PathContext.Provider value={path}>
      <App />
    </PathContext.Provider>
  )
}
export { headTags, PAGES, SITE } from './seo'
