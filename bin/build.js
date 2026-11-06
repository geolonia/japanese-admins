#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const JSONStream = require('JSONStream');

const root = path.dirname(path.dirname(__filename))
const file = process.argv[2] || path.join(root, 'data', 'N03-20260101.geojson')
const stream = fs.createReadStream(file);
const parser = JSONStream.parse('features.*');

const data = {}
const skipped = {}

/**
 * 市区町村の名前を返す。都道府県・郡（N03_003）・市区町村（N03_004）・政令指定都市の区（N03_005）をつなげる
 * （北海道の振興局 N03_002 は含めない）。
 */
const adminName = (props) =>
  `${props.N03_001}${props.N03_003 || ''}${props.N03_004 || ''}${props.N03_005 || ''}`

stream.pipe(parser)
  .on('data', function (feature) {
    const props = feature.properties
    const adminCode = props.N03_007
    // 行政区域コードの無い区域と、所属未定地（コードの下 3 桁が 000）はファイルにしない
    if (!adminCode || /000$/.test(adminCode)) {
      const label = `${adminCode || '(none)'} ${props.N03_001}${props.N03_004 || ''}`
      skipped[label] = (skipped[label] || 0) + 1
      return
    }
    const prefCode = adminCode.substr(0, 2)

    if (!data[prefCode]) {
      data[prefCode] = {}
    }

    if (!data[prefCode][adminCode]) {
      data[prefCode][adminCode] = {
        features: []
      }
    }

    // 公開するファイルは Polygon だけにする。MultiPolygon は部分ごとに 1 つの Feature にする
    const geometry = feature.geometry
    const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]
    for (const coordinates of polygons) {
      data[prefCode][adminCode].features.push({
        type: 'Feature',
        properties: { name: adminName(props) },
        geometry: { type: 'Polygon', coordinates }
      })
    }
  })
  .on('end', function () {
    let count = 0
    for (const pref in data) {
      const dir = path.join(root, 'docs', pref)
      fs.mkdirSync(dir, { recursive: true })
      for (const admin in data[pref]) {
        const file = path.join(root, 'docs', pref, `${admin}.json`)
        const newjson = {
          type: "FeatureCollection",
          features: data[pref][admin].features
        }

        fs.writeFileSync(file, JSON.stringify(newjson))
        count++
      }
    }
    console.log(`wrote ${count} files`)
    for (const label in skipped) console.log(`skipped: ${label} (${skipped[label]} features)`)
  });
