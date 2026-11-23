import { expect, test } from 'claude-code/testing'
import type { CommandRunInput, SessionInfo } from 'claude-code'

// What the engine stamps on a typed command; the hook reads only command and args.
const muzik = (args: string) => ({ command: 'studio-muzik', args }) as unknown as CommandRunInput

test('/muzik lists nothing at first and refuses a non-MP3', async ($, on) => {
  on('process.hookEnv', () => ({ value: { CLAUDE_PLUGIN_DATA: 'C:/data' } }))
  on('fs.exists', () => ({ value: false }))

  const empty = await $.command.run(muzik(''))
  expect(empty.text).toContain('Henüz şarkı yok')

  const wrong = await $.command.run(muzik('ekle C:/x/notes.txt'))
  expect(wrong.text).toBe('Sadece .mp3 dosyaları eklenebilir.')
})

test('/muzik ekle copies an MP3 into the music folder', async ($, on) => {
  const copied: string[][] = []
  let isAdded = false
  const writes: string[] = []

  on('process.hookEnv', () => ({ value: { CLAUDE_PLUGIN_DATA: 'C:/data' } }))
  on('session.info', () => ({ value: { platform: 'windows' } as SessionInfo }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 1000, mtimeMs: 0, isLink: false } }))
  on('fs.exists', () => ({ value: isAdded }))
  on('fs.write', (_, e) => {
    writes.push(e.path)
    return { value: undefined }
  })
  on('process.run', (_, e) => {
    copied.push([...e.argv])
    isAdded = true
    return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  on('fs.list', () => ({
    value: [{ name: 'Baseplate Song.mp3', kind: 'file', size: 1000, mtimeMs: 0, isLink: false }],
  }))

  const added = await $.command.run(muzik('ekle "C:/Music/Baseplate Song.mp3"'))
  expect(added.text).toContain('Eklendi: Baseplate Song')
  expect(copied[0]?.[0]).toBe('powershell')
  expect(writes[0]?.replaceAll('\\', '/')).toBe('C:/data/music/.volume')

  const list = await $.command.run(muzik(''))
  expect(list.text).toContain('1. Baseplate Song')
})
