
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---src-pages-index-tsx": preferDefault(require("/Users/Work/Code/stcss/examples/gatsby/src/pages/index.tsx"))
}

