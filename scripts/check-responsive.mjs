import { setTimeout as sleep } from 'node:timers/promises'

const BASE_URL = process.env.KARNYX_BASE_URL || 'http://127.0.0.1:5173'
const CDP_PORT = process.env.KARNYX_CDP_PORT || '9222'
const ROUTES = ['/', '/marco']
const WIDTHS = [1440, 1280, 1100, 900, 768, 720, 540, 460, 360]

class Cdp {
  constructor(ws) {
    this.ws = ws
    this.seq = 0
    this.pending = new Map()
  }

  static async connect(url) {
    const ws = new WebSocket(url)
    await new Promise((resolve, reject) => {
      ws.onopen = resolve
      ws.onerror = () => reject(new Error(`Connexion CDP impossible: ${url}`))
    })

    const cdp = new Cdp(ws)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      const entry = message.id ? cdp.pending.get(message.id) : null
      if (!entry) return
      cdp.pending.delete(message.id)
      if (message.error) entry.reject(new Error(message.error.message))
      else entry.resolve(message.result)
    }

    return cdp
  }

  send(method, params = {}) {
    const id = ++this.seq
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
    })
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || 'Evaluation impossible')
    }
    return result.result.value
  }
}

async function findPageTarget() {
  const response = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)
  const targets = await response.json()
  const page = targets.find((target) => target.type === 'page')
  if (!page) throw new Error('Aucune cible page trouvee dans Chrome DevTools Protocol')
  return page.webSocketDebuggerUrl
}

const PROBE = `(() => {
  const de = document.documentElement
  const viewport = de.clientWidth
  const levels = Array.from(document.querySelectorAll('.org-level')).map((level) => {
    const label = level.querySelector('.org-level__label')
    const cards = Array.from(level.querySelectorAll('.player-card'))
    return {
      label: label ? label.textContent.trim() : '',
      count: cards.length,
      widths: cards.map((card) => Math.round(card.getBoundingClientRect().width)),
      columns: getComputedStyle(level.querySelector('.org-level__grid') || level).gridTemplateColumns,
    }
  })
  const burger = document.querySelector('.nav__burger')
  const links = document.querySelector('.nav__links')
  const overflowing = Array.from(document.body.querySelectorAll('*'))
    .filter((el) => {
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && (rect.right > viewport + 1 || rect.left < -1)
    })
    .slice(0, 6)
    .map((el) => el.tagName.toLowerCase() + '.' + String(el.className || '').split(' ')[0])
  return {
    scrollWidth: de.scrollWidth,
    clientWidth: viewport,
    burger: burger ? getComputedStyle(burger).display !== 'none' : null,
    links: links ? getComputedStyle(links).display !== 'none' : null,
    levels,
    overflowing,
  }
})()`

function checkRow(route, width, probe) {
  const issues = []

  if (probe.scrollWidth > probe.clientWidth + 1) {
    issues.push(`debordement horizontal (${probe.scrollWidth} > ${probe.clientWidth})`)
  }
  if (probe.overflowing.length > 0) {
    issues.push(`elements hors cadre: ${probe.overflowing.join(', ')}`)
  }

  const cardWidths = new Set()
  for (const level of probe.levels) {
    const unique = [...new Set(level.widths)]
    if (unique.length > 1) {
      issues.push(`${level.label}: largeur de carte irreguliere [${unique.join(', ')}]`)
    }
    unique.forEach((value) => cardWidths.add(value))
  }
  if (cardWidths.size > 1) {
    issues.push(`largeurs differentes entre niveaux: [${[...cardWidths].join(', ')}]`)
  }

  if (width <= 900 && probe.burger !== true) issues.push('burger absent <= 900px')
  if (width > 900 && probe.links !== true) issues.push('menu horizontal absent > 900px')

  return { issues, cardWidths: [...cardWidths], levels: probe.levels }
}

async function main() {
  const target = await findPageTarget()
  const cdp = await Cdp.connect(target)

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')

  const failures = []
  const widths = new Map()

  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      })
      await cdp.send('Page.navigate', { url: `${BASE_URL}${route}` })
      await sleep(900)

      const probe = await cdp.evaluate(PROBE)
      const { issues, cardWidths, levels } = checkRow(route, width, probe)

      if (!widths.has(width)) widths.set(width, new Set())
      cardWidths.forEach((value) => widths.get(width).add(value))

      const detail = levels
        .map((level) => `${level.label}:${level.count}x[${[...new Set(level.widths)].join('|')}]`)
        .join(' ')

      const status = issues.length === 0 ? 'OK  ' : 'FAIL'
      console.log(`${status} ${route.padEnd(7)} ${String(width).padStart(4)}px  ${detail}`)
      if (issues.length > 0) {
        issues.forEach((issue) => console.log(`       -> ${issue}`))
        failures.push(`${route} @ ${width}px : ${issues.join(' | ')}`)
      }
    }
  }

  console.log('')
  const widthReport = [...widths.entries()]
    .map(([width, values]) => `${width}px=[${[...values].join(',')}]`)
    .join('  ')
  console.log(`Largeurs de carte par viewport : ${widthReport}`)

  if (failures.length > 0) {
    console.error(`\n${failures.length} anomalie(s) responsive detectee(s)`)
    process.exit(1)
  }

  console.log('\nOK - responsive valide sur toutes les largeurs testees')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
