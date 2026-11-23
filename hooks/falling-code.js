// Luau lines that fall from the top of the backdrop and fade out on the way
// down, in a plain code font and colored like the Studio script editor.

const KEYWORDS = new Set(['local', 'function', 'end', 'true', 'false', 'return', 'if', 'then'])
const BUILTINS = new Set(['game', 'workspace', 'task', 'wait', 'print', 'Instance'])

// [text, x, font size, seconds to fall, delay in seconds]
const LINES = [
  ['local part = Instance.new("Part")', 60, 30, 22, 0],
  ['part.Anchored = true', 980, 28, 18, 4],
  ['wait(1)', 640, 36, 15, 9],
  ['humanoid.Health = 100', 240, 27, 20, 12],
  ['game:GetService("Players")', 860, 29, 24, 15],
  ['end', 1380, 38, 16, 2],
  ['part:Destroy()', 520, 28, 19, 17],
  ['task.spawn(function()', 1000, 27, 21, 7],
  ['print("Hello world!")', 40, 28, 17, 19],
]

const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function tokens(text) {
  const out = []
  const re = /"[^"]*"|[A-Za-z_][A-Za-z0-9_]*|[0-9]+|\s+|./g
  let match
  while ((match = re.exec(text)) !== null) {
    const word = match[0]
    let kind = 'tx'
    if (word.startsWith('"')) kind = 'st'
    else if (/^[0-9]+$/.test(word)) kind = 'nu'
    else if (KEYWORDS.has(word)) kind = 'kw'
    else if (BUILTINS.has(word)) kind = 'bi'
    else if (/^[A-Za-z_]/.test(word) && text[match.index + word.length] === '(') kind = 'fn'
    out.push([word, kind])
  }
  return out
}

export function fallingCode() {
  const style = `
.code { --kw: #f86d7c; --st: #adf195; --nu: #ffc600; --bi: #84d6f7; --fn: #fdfbac; --tx: #d4d4d4; }
@media (prefers-color-scheme: light) {
  .code { --kw: #b0123a; --st: #2f7d1c; --nu: #9a5c00; --bi: #0b62a8; --fn: #6a5a00; --tx: #3a3f47; }
}
.code text { font-family: Consolas, "Cascadia Mono", Menlo, monospace; white-space: pre; }
.kw { fill: var(--kw); } .st { fill: var(--st); } .nu { fill: var(--nu); }
.bi { fill: var(--bi); } .fn { fill: var(--fn); } .tx { fill: var(--tx); }
@keyframes fall {
  0% { transform: translateY(-80px); opacity: 0; }
  8% { opacity: 0.7; }
  55% { opacity: 0.7; }
  85% { transform: translateY(1050px); opacity: 0; }
  100% { transform: translateY(1050px); opacity: 0; }
}
.fall { opacity: 0; animation: fall linear infinite; }
`
  const groups = LINES.map(([text, x, size, seconds, delay]) => {
    const spans = tokens(text)
      .map(([word, kind]) => `<tspan class="${kind}">${escape(word)}</tspan>`)
      .join('')
    return (
      `<g class="fall" style="animation-duration: ${seconds}s; animation-delay: -${delay}s;">` +
      `<text x="${x}" y="0" font-size="${size}">${spans}</text>` +
      `</g>`
    )
  }).join('')

  return { style, markup: `<g class="code">${groups}</g>` }
}
