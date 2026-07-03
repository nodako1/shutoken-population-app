# 首都圏 総人口ビューア

e-Stat API(ver 3.0)から首都圏1都7県(東京・神奈川・埼玉・千葉・茨城・栃木・群馬・山梨)の総人口を取得し、
西暦降順の表で表示する React アプリです。別途与えられた友好度CSVをもとに、
友好度の総和が最大となるよう都県を3グループ以下に分割し、表を色分けします。

## セットアップ

```bash
npm install
cp .env.example .env   # VITE_ESTAT_APP_ID に自分のappIdを設定
npm run dev
```

e-Stat APIの利用登録(無料)とアプリケーションID発行はこちら: https://www.e-stat.go.jp/api/

## 構成

```
src/
  api/estat.js        e-Stat APIクライアント + レスポンス整形
  logic/grouping.js   友好度CSVパース + 最適グルーピング(全探索・厳密解)
  components/         テーブル・凡例コンポーネント
  config.js           対象都県・統計表IDなどの設定
public/friendship.csv 友好度データ
```

## グルーピングアルゴリズム

各都県にグループ番号(0〜2)を割り当てる 3^8 = 6,561 通りを全探索し、
グループ内ペアの友好度総和が最大の分割を厳密に求めています。
ラベル入替えによる同一分割(例: {0,1} と {1,0})は
restricted growth string の考え方で枝刈りしています。
詳細は `src/logic/grouping.js` のコメントを参照してください。

## 出典

このアプリは「政府統計の総合窓口(e-Stat)」のAPI機能を使用していますが、
本アプリの内容は国によって保証されたものではありません。
(クレジット表記: https://www.e-stat.go.jp/api/api-info/credit)
