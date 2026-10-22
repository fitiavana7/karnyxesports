import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = path.join(root, 'dist-standalone')
const publicDir = path.join(root, 'public')
const out = path.join(root, 'maquette.html')

const html = fs.readFileSync(path.join(dist, 'index-standalone.html'), 'utf8')

const assetsDir = path.join(dist, 'assets')
const cssFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.css'))
const jsFile = fs.readdirSync(assetsDir).find((f) => f.endsWith('.js'))

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8')
const js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8')

if (js.includes('</script')) throw new Error('le bundle JS contient une sequence fermante de script')
if (css.includes('</style')) throw new Error('le bundle CSS contient une sequence fermante de style')

const dataUri = (file, mime) =>
  `data:${mime};base64,${fs.readFileSync(path.join(publicDir, file)).toString('base64')}`

const emblem = dataUri('emblem.jpg', 'image/jpeg')
const favicon = dataUri('favicon.png', 'image/png')
const classement = dataUri('classement.jpg', 'image/jpeg')
const event = dataUri('event.jpeg', 'image/jpeg')

const registry = `<script>window.__KARNYX_ASSET_REGISTRY__=${JSON.stringify({
  'emblem.jpg': emblem,
  'classement.jpg': classement,
  'event.jpeg': event,
})};</script>`

const outHtml = html
  .replace(
    new RegExp(`<link[^>]*href="\\./assets/${cssFile}"[^>]*>`),
    () => `<style>\n${css}\n</style>`,
  )
  .replace(
    new RegExp(`<script[^>]*src="\\./assets/${jsFile}"[^>]*></script>`),
    () => `<script type="module">\n${js}\n</script>`,
  )
  .replace('</head>', () => `${registry}\n</head>`)
  .replace('./favicon.png', () => favicon)
  .replace('./emblem.jpg', () => emblem)

fs.writeFileSync(out, outHtml)

const size = (fs.statSync(out).size / 1024).toFixed(1)
console.log(`maquette.html : ${size} Ko`)
console.log(`  style inline  : ${outHtml.includes('<style>')}`)
console.log(`  script inline : ${outHtml.includes('<script type="module">')}`)
console.log(`  registry      : ${outHtml.includes('__KARNYX_ASSET_REGISTRY__')}`)
console.log(`  img inline    : ${outHtml.includes('data:image/jpeg;base64')}`)
console.log(`  balises div   : ${(outHtml.match(/<div/g) || []).length}`)
