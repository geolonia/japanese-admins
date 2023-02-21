# GeoJSON endpoints for Japanese administrations

```
https://geolonia.github.io/japanese-admins/<prefCode>/<adminCode>.json
```

## ビルド方法

「国土数値情報（行政区域データ）」（全国版）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html)をダウンロードして、`data` ディレクトリに配置してください。

以下のコマンドで、`docs` ディレクトリに JSON ファイルが生成されます。

```
$ npm install
$ npm run build
```

## 備考

* [「国土数値情報（行政区域データ）」（国土交通省）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html)を加工して作成
* 政令指定都市は、区単位に分割してJSONファイルを作成しています。そのため JSON ファイルの数は、市区町村数（政令市、市、特別区、区、町、村） - 政令市数 となります。
