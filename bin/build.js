#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const JSONStream = require('JSONStream');

const file = path.join(path.dirname(path.dirname(__filename)), '/data/N03-22_220101.geojson')
const stream = fs.createReadStream(file);
const parser = JSONStream.parse('features.*');

const data = {}

stream.pipe(parser)
  .on('data', function (feature) {
    try {
      const prefCode = feature.properties.N03_007.substr(0, 2)
      const adminCode = feature.properties.N03_007

      if (!data[prefCode]) {
        data[prefCode] = {}
      }

      if (!data[prefCode][adminCode]) {
        data[prefCode][adminCode] = {
          features: []
        }
      }

      data[prefCode][adminCode].features.push({
        type: 'Feature',
        properties: { name: `${feature.properties['N03_001']}${feature.properties['N03_003'] || ''}${feature.properties['N03_004'] || ''}` },
        geometry: feature.geometry
      })
    } catch (e) {
    }
  })
  .on('end', function () {

    for (const pref in data) {
      const dir = path.join(path.dirname(path.dirname(__filename)), 'docs', pref)
      fs.mkdirSync(dir, { recursive: true })
      for (const admin in data[pref]) {
        const file = path.join(path.dirname(path.dirname(__filename)), 'docs', pref, `${admin}.json`)
        const newjson = {
          type: "FeatureCollection",
          features: data[pref][admin].features
        }

        fs.writeFileSync(file, JSON.stringify(newjson))
      }
    }
  });
