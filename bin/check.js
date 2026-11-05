#!/usr/bin/env node

// docs の JSON ファイルが公開している形式に合っているかを確かめる。合わなければ終了コード 1 で終わる。

const path = require('path')
const fs = require('fs')

const docs = path.join(path.dirname(path.dirname(__filename)), 'docs')
const errors = []
let files = 0

const isPosition = (p) =>
  Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]) &&
  p[0] >= 122 && p[0] <= 154 && p[1] >= 20 && p[1] <= 46

for (const pref of fs.readdirSync(docs)) {
  const dir = path.join(docs, pref)
  if (!fs.statSync(dir).isDirectory()) continue
  if (!/^\d{2}$/.test(pref)) errors.push(`${pref}: directory name is not a prefecture code`)
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue
    files++
    const file = `${pref}/${name}`
    const code = name.slice(0, -5)
    if (!/^\d{5}$/.test(code) || !code.startsWith(pref)) errors.push(`${file}: file name is not an admin code of prefecture ${pref}`)
    if (code.endsWith('000')) errors.push(`${file}: unassigned area must not be published`)
    let json
    try {
      json = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'))
    } catch (e) {
      errors.push(`${file}: invalid JSON (${e.message})`)
      continue
    }
    if (json.type !== 'FeatureCollection' || !Array.isArray(json.features) || json.features.length === 0) {
      errors.push(`${file}: not a non-empty FeatureCollection`)
      continue
    }
    const names = new Set()
    for (const feature of json.features) {
      const g = feature.geometry
      if (feature.type !== 'Feature' || !g || g.type !== 'Polygon') {
        errors.push(`${file}: every feature must be a Polygon`)
        break
      }
      const keys = Object.keys(feature.properties || {})
      if (keys.length !== 1 || keys[0] !== 'name' || !feature.properties.name) {
        errors.push(`${file}: properties must be only a non-empty name`)
        break
      }
      names.add(feature.properties.name)
      const ring = g.coordinates[0]
      if (!Array.isArray(ring) || ring.length < 4 || !ring.every(isPosition)) {
        errors.push(`${file}: outer ring must have 4+ positions within Japan`)
        break
      }
    }
    if (names.size !== 1) errors.push(`${file}: features must share one name (${[...names].join(', ')})`)
  }
}

console.log(`checked ${files} files`)
if (errors.length) {
  for (const e of errors.slice(0, 50)) console.error(e)
  console.error(`${errors.length} errors`)
  process.exit(1)
}
