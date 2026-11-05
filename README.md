# GeoJSON endpoints for Japanese administrations

```
https://geolonia.github.io/japanese-admins/<prefCode>/<adminCode>.json
```

## データの時点

2026 年（令和 8 年）1 月 1 日時点の行政区域。

## ファイルの形式

- 1 つの市区町村（政令指定都市は区）につき 1 ファイル。ファイル名は行政区域コード
- `FeatureCollection` で、各 Feature の geometry は `Polygon`。飛び地や島など、複数の部分からなる市区町村は部分ごとに Feature が分かれる
- 各 Feature の `properties.name` は、都道府県・郡・市区町村・区をつなげた名前（例: `沖縄県島尻郡久米島町`、`静岡県浜松市中央区`）。北海道の振興局・東京都の支庁は含めない
- 所属未定地（行政区域コードの下 3 桁が `000`）のファイルは作らない

## 廃止されたコードのファイル

市区町村の合併や区の再編でコードが無くなっても、そのファイルは消さずに残す（古いコードを使っているアプリの地図が表示されなくなるのを防ぐため）。残しているファイルは、最後に含まれていた版の形のまま更新しない。

| コード | 名前 | 廃止 | 最後に含まれていた版 |
|---|---|---|---|
| 22131〜22137 | 静岡県浜松市中区・東区・西区・南区・北区・浜北区・天竜区 | 2024-01-01（浜松市の区の再編） | 2022 年 1 月 1 日時点 |

## ビルド方法

[「国土数値情報（行政区域データ）」（全国版）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html)の `N03-20260101_GML.zip` をダウンロードし、中の `N03-20260101.geojson` を `data` ディレクトリに置く。

以下のコマンドで、`docs` ディレクトリに JSON ファイルが生成される。別の版のファイルを使うときは、パスを引数で渡す（`npm run build -- data/N03-xxxx.geojson`）。

```
$ npm install
$ npm run build
```

## 出典

- 出典：国土交通省国土数値情報ダウンロードサイト（https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html ）
- 「国土数値情報（行政区域データ）」（国土交通省）を加工して作成。加工の内容: 行政区域コードごとにファイルを分け、属性を名前だけにし、MultiPolygon を Polygon に分けた
- ライセンス: [国土数値情報ダウンロードサイトコンテンツ利用規約（政府標準利用規約準拠版）](https://nlftp.mlit.go.jp/ksj/other/agreement_01.html)（CC BY 4.0 互換）
