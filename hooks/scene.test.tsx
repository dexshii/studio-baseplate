import { expect, test } from 'claude-code/testing'

test('the backdrop scene stays within the engine limits', async $ => {
  const ui = await $.ui.mount({ plugin: 'studio-baseplate', component: 'Backdrop', surface: 'desktop', props: { scene: 'baseplate', plugin: 'studio-baseplate', glass: { blur: 14, opacity: 0.72 } } })
  const svg = await ui.find({ type: 'Svg' })
  const source = String(svg?.props.source ?? '')
  expect(source.length).toBeGreaterThan(1000)
  expect(source.length).toBeLessThan(131072)
  expect(source).not.toContain('href')
  await ui.unmount()
})
