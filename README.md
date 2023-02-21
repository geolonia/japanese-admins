# GeoJSON endpoints for Japanese administrations

```
https://geolonia.github.io/japanese-admins/<prefCode>/<adminCode>.json
```

* [「国土数値情報（行政区域データ）」（国土交通省）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html)を加工して作成
* 政令指定都市は、区単位に分割してJSONファイルを作成しています。そのため JSON ファイルの数は、市区町村数（政令市、市、特別区、区、町、村） - 政令市数 となります。
