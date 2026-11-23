import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { fallingCode } from './falling-code.js'

// Studio-style grays with Studio blue as the accent. Dark is the default
// Studio look; light is the Studio light theme.
const { theme, problems } = makeColors({
  label: 'Studio Baseplate',
  roles: { accent: '#00a2ff', danger: '#e5484d', success: '#00b06f', warning: '#f5a623', pro: '#a371f7' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6e9ee',
        'surface-1': '#eef1f4',
        'surface-2': '#f7f8fa',
        'text-primary': '#16191d',
        'text-secondary': '#3a4049',
        'text-muted': '#545b66',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1a1c20',
        'surface-1': '#212328',
        'surface-2': '#272a30',
        'surface-3': '#2d3036',
        'text-primary': '#f1f3f6',
        'text-secondary': '#c3c8d0',
        'text-muted': '#9aa1ab',
      },
    },
  },
})

// The person's messages: a selected part, outlined in Studio blue.
const inputs = theme.inputs as Record<'light' | 'dark', Record<string, string>>
inputs.light['bg-user-message'] = '#dbeeff'
inputs.light['text-user-message'] = '#0b2236'
inputs.dark['bg-user-message'] = '#15304a'
inputs.dark['text-user-message'] = '#eaf5ff'

// ---------- backdrop: a baseplate with a few floating bricks ----------

type Shades = readonly [top: string, left: string, right: string]

const r = (n: number) => Math.round(n * 10) / 10

function brick(cx: number, cy: number, s: number, h: number, [top, left, right]: Shades, cls: string): string {
  const w = s * 0.866
  const p = (pts: number[][]) => pts.map(([x, y]) => `${r(x!)},${r(y!)}`).join(' ')
  const studs = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5],
  ]
    .map(([u, v]) => {
      const x = cx + ((u! - v!) * w) / 2
      const y = cy + ((u! + v!) * s) / 4
      return (
        `<ellipse cx="${r(x)}" cy="${r(y + s * 0.05)}" rx="${r(s * 0.17)}" ry="${r(s * 0.085)}" fill="${left}"/>` +
        `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s * 0.17)}" ry="${r(s * 0.085)}" fill="${top}" stroke="${right}" stroke-width="1.5"/>`
      )
    })
    .join('')

  return (
    `<g class="${cls}">` +
    `<polygon points="${p([[cx - w, cy], [cx, cy + s / 2], [cx, cy + s / 2 + h], [cx - w, cy + h]])}" fill="${left}"/>` +
    `<polygon points="${p([[cx, cy + s / 2], [cx + w, cy], [cx + w, cy + h], [cx, cy + s / 2 + h]])}" fill="${right}"/>` +
    `<polygon points="${p([[cx, cy - s / 2], [cx + w, cy], [cx, cy + s / 2], [cx - w, cy]])}" fill="${top}"/>` +
    studs +
    `</g>`
  )
}

// Move handles, in the usual axis colors.
function gizmo(cx: number, cy: number, len: number): string {
  const arrow = (dx: number, dy: number, color: string) => {
    const x = cx + dx * len
    const y = cy + dy * len
    const nx = -dy * 9
    const ny = dx * 9
    return (
      `<line x1="${cx}" y1="${cy}" x2="${r(x)}" y2="${r(y)}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>` +
      `<polygon points="${r(x + dx * 22)},${r(y + dy * 22)} ${r(x + nx)},${r(y + ny)} ${r(x - nx)},${r(y - ny)}" fill="${color}"/>`
    )
  }
  return (
    `<g class="giz">` +
    arrow(0.866, 0.5, '#ff4d4d') +
    arrow(-0.866, 0.5, '#3a8dff') +
    arrow(0, -1, '#4cd964') +
    `<circle cx="${cx}" cy="${cy}" r="7" fill="#f1f3f6"/>` +
    `</g>`
  )
}

const RED: Shades = ['#e8483d', '#c43a30', '#9f2e26']
const BLUE: Shades = ['#2ea8ff', '#1786d9', '#0f68ad']
const GREEN: Shades = ['#4cc764', '#3aa34f', '#2c823d']
const YELLOW: Shades = ['#f7c843', '#d9aa2c', '#b78d21']

const CODE = fallingCode()

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
svg { --base: #dfe3e9; --stud: #d2d8e0; --hi: #eceff3; --seam: #cfd5dd; --sel: #00a2ff; }
@media (prefers-color-scheme: dark) {
  svg { --base: #15171a; --stud: #1c1f23; --hi: #22252a; --seam: #1a1c20; }
}
.base { fill: var(--base); }
.stud { fill: var(--stud); }
.hi { fill: var(--hi); }
.seam { fill: none; stroke: var(--seam); stroke-width: 2; }
.sel { fill: none; stroke: var(--sel); stroke-width: 3; stroke-dasharray: 10 8; opacity: 0.9; }
.shadow { fill: #000; opacity: 0.12; }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes march { to { stroke-dashoffset: -36; } }
.a { animation: bob 9s ease-in-out infinite; }
.b { animation: bob 11s ease-in-out -3s infinite; }
.c { animation: bob 13s ease-in-out -6s infinite; }
.d { animation: bob 10s ease-in-out -1s infinite; }
.sel { animation: march 2.4s linear infinite; }
${CODE.style}
</style>
<defs>
<pattern id="plate" width="40" height="40" patternUnits="userSpaceOnUse">
<rect width="40" height="40" class="base"/>
<path d="M0 0.5H40M0.5 0V40" class="seam"/>
<circle cx="20" cy="20" r="11" class="stud"/>
<circle cx="18.5" cy="18.5" r="7.5" class="hi"/>
</pattern>
</defs>
<rect width="1600" height="1000" fill="url(#plate)"/>
<!-- falling Luau lines -->
${CODE.markup}
<!-- floating parts kept to the corners, away from the words -->
<ellipse cx="200" cy="250" rx="70" ry="22" class="shadow"/>
${brick(200, 150, 90, 40, GREEN, 'a')}
<ellipse cx="1400" cy="330" rx="120" ry="34" class="shadow"/>
<g class="b">
${brick(1400, 200, 150, 60, BLUE, '')}
<polygon points="1255,195 1400,112 1545,195 1545,265 1400,348 1255,265" class="sel"/>
${gizmo(1400, 150, 95)}
</g>
<ellipse cx="230" cy="900" rx="110" ry="30" class="shadow"/>
${brick(230, 770, 130, 55, RED, 'c')}
<ellipse cx="1420" cy="910" rx="90" ry="26" class="shadow"/>
${brick(1420, 800, 105, 45, YELLOW, 'd')}
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'baseplate', glass: { blur: 14, opacity: 0.72 } },
}

const STYLE: ThemeSetArgs['style'] = {
  Heading: { fontWeight: 'bold' },
  UserMessage: {
    backgroundColor: 'bg-user-message',
    color: 'text-user-message',
    radius: 4,
    borderWidth: 2,
    borderColor: '#00a2ff',
    paddingX: 14,
    paddingY: 10,
  },
  ToolUse: { fontFamily: ['code'], backgroundColor: 'surface-1', radius: 4, paddingX: 8 },
}

const SOUND: ThemeSetArgs['sound'] = {
  cues: {
    send: { layers: [{ wave: 'triangle', notes: ['G5', 'C6'], step: 0.05, gain: 0.25 }] },
    done: { layers: [{ wave: 'bell', notes: ['C5', 'E5', 'G5'], step: 0.09, gain: 0.3 }] },
    click: { layers: [{ wave: 'triangle', notes: ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'], gain: 0.2 }] },
  },
}

// ---------- music: the person's own MP3s, kept in the mod's music folder ----------

type Engine = EngineInterface
type Playback = { isStopped: boolean; isSkipped: boolean }

const HELP = [
  'Studio müzik komutları:',
  '  /studio-muzik                  şarkıları listeler',
  '  /studio-muzik ekle <yol.mp3>   bir MP3 dosyasını ekler',
  '  /studio-muzik cal [no]         çalar (sırayla, başa döner)',
  '  /studio-muzik sonraki          sonraki şarkıya geçer',
  '  /studio-muzik dur              durdurur',
  '  /studio-muzik ses <0-100>      ses seviyesi',
  '  /studio-muzik sil <no>         şarkıyı listeden siler',
].join('\n')

// Plays one file until it ends, printing a dot every quarter second so the
// mod can stop it between dots. The volume file is read as it plays.
const PLAYER = [
  'Add-Type -AssemblyName PresentationCore',
  '$p = New-Object System.Windows.Media.MediaPlayer',
  '$p.Volume = [double](Get-Content -LiteralPath $env:VOLFILE -ErrorAction SilentlyContinue | Select-Object -First 1)',
  '$p.Open([Uri]$env:SONG); $p.Play()',
  '$t = 0; while (-not $p.NaturalDuration.HasTimeSpan -and $t -lt 100) { Start-Sleep -Milliseconds 100; $t++ }',
  'if (-not $p.NaturalDuration.HasTimeSpan) { [Console]::Error.WriteLine("acilamadi"); exit 2 }',
  '$ms = $p.NaturalDuration.TimeSpan.TotalMilliseconds',
  '$sw = [Diagnostics.Stopwatch]::StartNew(); $n = 0',
  'while ($sw.ElapsedMilliseconds -lt $ms) {',
  '  Start-Sleep -Milliseconds 250; [Console]::Out.Write("."); [Console]::Out.Flush(); $n++',
  '  if ($n % 4 -eq 0) { $v = Get-Content -LiteralPath $env:VOLFILE -ErrorAction SilentlyContinue | Select-Object -First 1; if ($v) { $p.Volume = [double]$v } }',
  '}',
  '$p.Close()',
].join('\n')

const SLICE = 3 * 1024 * 1024
let playback: Playback | undefined
let volume = 0.6

// Songs live in the plugin's data folder, which survives updates of the mod.
let dataDir: string | undefined
async function musicDir($: Engine): Promise<string> {
  if (dataDir === undefined) {
    const env = await $.process.hookEnv()
    dataDir = (env.CLAUDE_PLUGIN_DATA ?? $.plugin.root).replaceAll('\\', '/')
  }
  return `${dataDir}/music`
}
const volumeFile = async ($: Engine) => `${await musicDir($)}/.volume`
const title = (name: string) => name.replace(/\.mp3$/i, '')

async function isWindows($: Engine): Promise<boolean> {
  return (await $.session.info()).platform === 'windows'
}

async function songs($: Engine): Promise<string[]> {
  const dir = await musicDir($)
  if (!(await $.fs.exists(dir))) {
    return []
  }
  const entries = await $.fs.list(dir)
  return entries
    .filter(entry => entry.kind === 'file' && entry.name.toLowerCase().endsWith('.mp3'))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b))
}

async function playOne($: Engine, name: string, run: Playback): Promise<void> {
  const path = `${await musicDir($)}/${name}`

  if (await isWindows($)) {
    const child = $.process.spawn({
      argv: ['powershell', '-NoProfile', '-NonInteractive', '-Command', PLAYER],
      env: { SONG: path.replaceAll('/', '\\'), VOLFILE: (await volumeFile($)).replaceAll('/', '\\') },
    })
    for await (const piece of child) {
      if (run.isStopped || run.isSkipped) {
        break
      }
      if ('stream' in piece && piece.stream === 'stderr' && piece.text.trim() !== '') {
        $.ui.toast(`Çalınamadı: ${title(name)}`)
      }
    }
    return
  }

  const stop = new AbortController()
  const watch = $.clock.every(250, () => {
    if (run.isStopped || run.isSkipped) {
      stop.abort()
    }
  })
  try {
    // Read in slices of a multiple of 3 bytes, so their base64 joins cleanly.
    let base64 = ''
    for (let offset = 0; ; offset += SLICE) {
      const part = await $.fs.read(path, { as: 'bytes', offset, length: SLICE })
      base64 += part.base64
      if (part.base64.length < (SLICE / 3) * 4) {
        break
      }
    }
    await $.audio.play({ base64, mime: 'audio/mpeg' }, { gain: volume, signal: stop.signal })
  } finally {
    watch.cancel()
  }
}

function stopMusic($: Engine): void {
  if (playback !== undefined) {
    playback.isStopped = true
    playback = undefined
  }
  $.ui.status(undefined)
}

async function playFrom($: Engine, start: number): Promise<void> {
  stopMusic($)
  await $.fs.write(await volumeFile($), String(volume))
  const run: Playback = { isStopped: false, isSkipped: false }
  playback = run

  let index = start
  while (!run.isStopped) {
    const list = await songs($)
    if (list.length === 0) {
      break
    }
    const name = list[index % list.length]!
    $.ui.status(`♪ ${title(name)}`)
    try {
      await playOne($, name, run)
    } catch (error) {
      $.ui.toast(`Çalınamadı: ${title(name)} (${String(error)})`)
      if (list.length === 1) {
        break
      }
    }
    run.isSkipped = false
    index += 1
  }

  if (playback === run) {
    playback = undefined
    $.ui.status(undefined)
  }
}

async function addSong($: Engine, raw: string): Promise<string> {
  const source = raw.trim().replace(/^["']|["']$/g, '')
  if (source === '') {
    return 'Bir MP3 yolu yaz: /studio-muzik ekle C:\\Users\\sen\\Music\\sarki.mp3'
  }
  if (!source.toLowerCase().endsWith('.mp3')) {
    return 'Sadece .mp3 dosyaları eklenebilir.'
  }
  const stat = await $.fs.stat(source).catch(() => undefined)
  if (stat === undefined || stat.kind !== 'file') {
    return `Dosya bulunamadı: ${source}`
  }

  const name = source.split(/[\\/]/).pop()!
  const target = `${await musicDir($)}/${name}`
  await $.fs.write(await volumeFile($), String(volume)) // also creates the music folder

  const copy = (await isWindows($))
    ? await $.process.run(
        ['powershell', '-NoProfile', '-NonInteractive', '-Command', 'Copy-Item -LiteralPath $env:SRC -Destination $env:DST -Force'],
        { env: { SRC: source, DST: target.replaceAll('/', '\\') }, timeoutMs: 120_000 },
      )
    : await $.process.run(['cp', source, target], { timeoutMs: 120_000 })

  if (copy.exitCode !== 0) {
    return `Kopyalanamadı: ${copy.stderr.trim() || `çıkış kodu ${copy.exitCode}`}`
  }
  const list = await songs($)
  return `Eklendi: ${title(name)} (${list.indexOf(name) + 1}. sırada). Çalmak için: /studio-muzik cal ${list.indexOf(name) + 1}`
}

async function listText($: Engine): Promise<string> {
  const list = await songs($)
  const rows = list.length === 0
    ? ['Henüz şarkı yok. Eklemek için: /studio-muzik ekle <yol.mp3>']
    : list.map((name, i) => `  ${i + 1}. ${title(name)}`)
  return [`Şarkılar (ses %${Math.round(volume * 100)}):`, ...rows, '', HELP].join('\n')
}

async function music($: Engine, args: string): Promise<string> {
  const [verb = '', ...rest] = args.trim().split(/\s+/)
  const arg = args.trim().slice(verb.length).trim()

  switch (verb.toLowerCase()) {
    case '':
    case 'liste':
      return listText($)
    case 'ekle':
      return addSong($, arg)
    case 'cal':
    case 'çal': {
      const list = await songs($)
      if (list.length === 0) {
        return 'Henüz şarkı yok. Eklemek için: /studio-muzik ekle <yol.mp3>'
      }
      const n = rest[0] === undefined ? 1 : Number(rest[0])
      if (!Number.isInteger(n) || n < 1 || n > list.length) {
        return `1 ile ${list.length} arasında bir numara yaz.`
      }
      void playFrom($, n - 1)
      return `Çalıyor: ${title(list[n - 1]!)}`
    }
    case 'sonraki':
      if (playback === undefined) {
        return 'Şu an bir şey çalmıyor.'
      }
      playback.isSkipped = true
      return 'Sonraki şarkıya geçiliyor.'
    case 'dur':
      stopMusic($)
      return 'Müzik durdu.'
    case 'ses': {
      const level = Number(rest[0])
      if (!Number.isFinite(level) || level < 0 || level > 100) {
        return 'Ses 0 ile 100 arasında olmalı: /studio-muzik ses 60'
      }
      volume = level / 100
      await $.fs.write(await volumeFile($), String(volume))
      $.store.set('volume', volume)
      return `Ses %${level} oldu.`
    }
    case 'sil': {
      const list = await songs($)
      const n = Number(rest[0])
      if (!Number.isInteger(n) || n < 1 || n > list.length) {
        return list.length === 0 ? 'Silinecek şarkı yok.' : `1 ile ${list.length} arasında bir numara yaz.`
      }
      const name = list[n - 1]!
      const path = `${await musicDir($)}/${name}`
      const removed = (await isWindows($))
        ? await $.process.run(['powershell', '-NoProfile', '-NonInteractive', '-Command', 'Remove-Item -LiteralPath $env:DST'], {
            env: { DST: path.replaceAll('/', '\\') },
          })
        : await $.process.run(['rm', path])
      return removed.exitCode === 0
        ? `Silindi: ${title(name)} (orijinal dosyan yerinde duruyor).`
        : `Silinemedi: ${removed.stderr.trim()}`
    }
    default:
      return HELP
  }
}

export const register: Register = on => {
  on('command.run', { command: 'studio-muzik' }, async ($, e) => ({
    text: await music($, e.args),
    isTextDisplayOnly: true,
  }))

  on('session.start', async ($, e, next) => {
    // A command clash with another plugin must never cost the theme.
    try {
      await $.command.register({ name: 'studio-muzik', description: 'Studio müzik çalar: kendi MP3 şarkılarını ekle ve çal' })
    } catch (error) {
      $.ui.log(`studio-muzik komutu eklenemedi: ${String(error)}`)
    }
    const saved = await $.store.get('volume')
    if (typeof saved === 'number') {
      volume = saved
    }

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    let set
    try {
      set = await $.theme.set({ ...LOOK, style: STYLE, sound: SOUND })
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(LOOK)
    }
    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="A Studio baseplate with a few bricks floating over it" isInteractive />
  })
}
