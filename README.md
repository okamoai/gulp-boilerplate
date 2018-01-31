 gulp.js Boilerplate
====

gulp.js を使用した静的ページ出力を対象にしたボイラープレート

## 推奨環境
```
"node": "8.9.4",
"npm": "4.0.5"
```
Windows 10 / MacOS 10.12 で動作確認しました。


## インストール方法

1.Git リポジトリをクローン
```sh
git clone https://github.com/okamoai/gulp-boilerplate.git
```

2.プロジェクトディレクトリに移動
```sh
cd gulp-boilerplate
```

3.Node.js パッケージをインストール
```sh
npm install
```

## 使用方法

### 環境別の規定値の設定
`config/*.json` で環境別の規定値を設定します。  
`NODE_ENV` と連動していて、

- `default.json` => `NODE_ENV=development`
- `stage.json` => `NODE_ENV=stage`
- `production.json` => `NODE_ENV=production`

となります。ファイルのフォーマットは以下になります。
```js
{
  "domain": "https://www.example.co.jp",
  "cdn": "https://cdn.example.co.jp",
  "path": "/"
}
```
- `domain` …ドメインをスキーム＋ホスト名を記述します。
- `cdn` …CDNを利用する場合、そのドメイン情報をスキーム＋ホスト名で記述します。
- `path` …プロジェクトのルートパス情報を記述します。（注：末尾のスラッシュは付けません。フルパスで記述してください）


### gulp.js タスクの設定
`gulp/config.js` に各タスクの設定情報があるので、プロジェクトの内容に合わせて適宜変更してください。  
主に変更が必要な個所は以下になります。

#### 標準実行タスクの指定
```js
const defaultTasks = {
  html: 'pug',
  css: 'pcss',
  js: 'js',
  font: 'font',
  sprite: 'sprite',
  image: 'imagemin',
}
```
各リソースファイルを生成するタスク名を指定します。ここで指定されたタスクが、`build` タスクや `watch` タスクで実行されるようになります。  

- HTML を生成するタスクに `pug` と `ejs`
- CSS を生成するタスクに `sass` と `postcss`
- JavaScript を生成するタスクに `js` と `jsConcat`

 があるので、使用する方を標準タスクとして指定します。

### gulp.js タスク

プロジェクトディレクトリ直下で以下のコマンドを叩くことで各種タスクを実行できます。
タスクの設定情報は `gulp/config.js` に、 タスクそのものの処理は `gulp/task/*.js` にタスクごとにファイルを分割して管理しています。
基本的にタスクは共通で環境オプションを追加することができ、以下の挙動の変化があります。
```sh
npm run [タスク名]:dev  # 開発環境用
npm run [タスク名]:stg  # テスト環境用
npm run [タスク名]:prd   # 本番環境用
```
`dist` 以下に環境別にデータが出力されます。
`npm run [タスク名]:dev` … `dist/development` 以下に出力
`npm run [タスク名]:stg` … `dist/stage` 以下に出力
`npm run [タスク名]:prd` … `dist/production` 以下に出力


#### タスク: `pug`

```sh
npm run pug:dev  # 開発環境用
npm run pug:stg  # テスト環境用
npm run pug:prd  # 本番環境用
```
[Pug](https://github.com/pugjs/pug)（旧Jade） から HTML へ出力します。

- `_`（アンダースコア）から始まるディレクトリやファイルは HTML 出力の対象外になります。（include 参照のみのファイルに使用します）
- 通常、拡張子は `html` で出力されますが、ファイル名を `hoge.htm.pug`, `hoge.php.pug` と記述すると、`hoge.htm`, `hoge.php` のように拡張子を変更してファイルを出力します。
- `//-data [JSONファイルパス]` の記述を行うと、JSON の内容を `data` 変数でアクセスできます。

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- 変数 `genRoot`（通常ドメイン） `cdnRoot`（CDNドメイン） で環境別のパス情報を出力します。img 要素、link 要素、script 要素の参照時に使用することで、ワンソースで環境別にリソース参照を分岐した出力が可能です。

#### タスク: `ejs`

```sh
npm run ejs:dev  # 開発環境用
npm run ejs:stg  # テスト環境用
npm run ejs:prd  # 本番環境用
```
[EJS](http://ejs.co/) から HTML へ出力します。  

- `_`（アンダースコア）から始まるディレクトリやファイルは HTML 出力の対象外になります。（include など、参照のみのファイルに使用します）
- 通常、拡張子は `html` で出力されますが、ファイル名を `hoge.htm.ejs`, `hoge.php.ejs` と記述すると、`hoge.htm`, `hoge.php` のように拡張子を変更してファイルを出力します。

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- 変数 `genRoot`（通常ドメイン） `cdnRoot`（CDNドメイン） で環境別のパス情報を出力します。img 要素、link 要素、script 要素の参照時に使用することで、ワンソースで環境別にリソース参照を分岐した出力が可能です。


#### タスク: `postcss`
```sh
npm run postcss:dev  # 開発環境用
npm run postcss:stg  # テスト環境用
npm run postcss:prd  # 本番環境用
```
[PostCSS](https://github.com/postcss/postcss) から CSS へ出力します。

- `_`（アンダースコア）から始まるディレクトリやファイルは CSS 出力の対象外になります。（include 参照のみのファイルに使用）
- [postcss-cssnext](https://github.com/MoOx/postcss-cssnext), [postcss-assets](https://github.com/assetsjs/postcss-assets), [postcss-partial-import](https://github.com/jonathantneal/postcss-partial-import), [css-mqpacker](https://github.com/hail2u/node-css-mqpacker),  [autoprefixer](https://github.com/postcss/autoprefixer) を使用しています。

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- `stg`, `prd` オプションで CSS が圧縮されて出力されます。（[cssnano](https://github.com/ben-eb/cssnano) を使用）
- `stg`, `prd` オプションで `url()` リソースの参照にキャッシュ無効化（Cachebuster）処理が行われます。

#### タスク: `js`
```sh
npm run js:dev  # 開発環境用
npm run js:stg  # テスト環境用
npm run js:prd  # 本番環境用
```
JavaScript を [Browserfy](http://browserify.org/) で連結して出力します。

- `_`（アンダースコア）から始まるディレクトリやファイルはエントリーポイント（ファイル出力）の対象外になります。
- npm package のライブラリは直接 `import` で読み込めますが、個別に記述した JavaScript はファイル名の先頭にアンダースコアをつけてローカルに置き、`import` で読み込んで使用します。

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- `dev` オプションで SourceMap が出力されます。（Browserfy の debug オプション）
- `stg`, `prd` オプションで JavaScript が圧縮されて出力されます。（[gulp-uglify](https://github.com/terinjokes/gulp-uglify) を使用）

#### タスク: `jsConcat`
```sh
npm run jsConcat:dev  # 開発環境用
npm run jsConcat:stg  # テスト環境用
npm run jsConcat:prd  # 本番環境用
```
JavaScript を [gulp-concat](https://www.npmjs.com/package/gulp-concat) で連結して出力します。

- `_`（アンダースコア）から始まるディレクトリの中にあるjsファイルを、ファイル名の昇順ソート順に連結し、ディレクトリ名から`_`を除いたファイル名で出力します。
- `js` タスクでは [Browserfy](http://browserify.org/) を使って連結するため、グローバル変数の汚染がありませんが、読み込んだJSを単純にグローバルに登録したい場合は こちらのタスクの方が向いています。

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- `stg`, `prd` オプションで JavaScript が圧縮されて出力されます。（[gulp-uglify](https://github.com/terinjokes/gulp-uglify) を使用）

#### タスク: `eslint`
```sh
npm run eslint
```
JavaScript ファイルを [ESLint](https://eslint.org/) を使って書式チェックを行います。  
チェック対象は `defaultTasks.js` で設定したファイルになります。  
具体的なルールの設定は `.eslintrc`, `.eslintignore` で行います。

#### タスク: `imagemin`
```sh
npm run imagemin:dev  # 開発環境用
npm run imagemin:stg  # テスト環境用
npm run imagemin:prd  # 本番環境用
```
画像ファイル（jpg, gif, png, svg）を劣化を極力抑えて圧縮します。

- `src/img` 以下のデータを対象に、`dist/[環境ディレクトリ]/[コンテンツルート]/img` に出力します。
- 圧縮には [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) と [pngquant](https://github.com/pornel/pngquant) を使用しています。

#### タスク: `font`
```sh
npm run font:dev  # 開発環境用
npm run font:stg  # テスト環境用
npm run font:prd  # 本番環境用
```
SVG ファイルから Webフォントファイル（eot, ttf, woff, woff2, svg）を生成し、同時に PostCSS Extend 定義ファイルを出力します。

- `src/font/**/_[ディレクトリ名]/*.svg` に格納されたファイルが、`dist/[環境ディレクトリ]/[コンテンツルート]/**/[ディレクトリ名].(eot|ttf|woff|woff2|svg)` に結合されて出力されます。
- `_`（アンダースコア）から始まるディレクトリ名のみが生成の対象になります。生成時にフォント名からアンダースコアは除外されます。
- ディレクトリ名がフォント名、SVGファイル名が個別表示の定義名と連動しています。
- フォントファイル出力と同時に `src/pcss/_webfont` 以下に Web フォント表示用の PostCSS Extend の定義ファイルが出力されます。
pcss ファイルから、`@import` で定義ファイルを読み込み、`@extend` で参照して Web フォントを表示します。

```css
@import "../_webfont/base";
@import "../_webfont/style1";
.icon:before {
  @extend webfont;
  @extend webfont-style1;
  @extend webfont-style1-arrowUp;
}
```

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- `dev` オプションで、 `sample/webfont` 以下に Web フォントの表示サンプルデータを出力します。

#### タスク `sprite`
```sh
npm run sprite:dev  # 開発環境用
npm run sprite:stg  # テスト環境用
npm run sprite:prd  # 本番環境用
```
PNG ファイルから CSS スプライト用の連結画像を生成し、同時に PostCSS Extend 定義ファイルを出力します。

- `src/img-splite/**/_[ディレクトリ名]/*.png` に格納されたファイルが、`dist/[環境ディレクトリ]/[コンテンツルート]/**/sprite_[ディレクトリ名].png` に結合されて出力されます。
- `_`（アンダースコア）から始まるディレクトリ名のみが生成の対象になります。生成時にファイル名からアンダースコアは除外されます。
- ディレクトリ名がスプライトファイル名、PNG ファイル名が個別表示の定義名と連動しています。
- PNG ファイル出力と同時に `src/pcss/_sprite` 以下に CSS スプライト表示用の PostCSS Extend の定義ファイルが出力されます。
pcss ファイルから、`@import` で定義ファイルを読み込み、`@extend` で参照して CSS スプライト画像を表示します。

```css
@import "../_sprite/base";
@import "../_sprite/style1";
.icon:before {
  @extend sprite;
  @extend sprite-style1;
  @extend sprite-style1-arrowUp;
}
```

環境オプションで上記共通処理以外に以下の挙動の変化があります。

- `dev` オプションで、 `sample/sprite` 以下に CSS スプライトの表示サンプルデータを出力します。

#### タスク `clean`
```sh
npm run clean:dev  # 開発環境用
npm run clean:stg  # テスト環境用
npm run clean:prd  # 本番環境用
```

`dist/[環境ディレクトリ]` データと `font`, `sprite` で生成された PostCSS ファイルを削除します。
つまり「タスクランナーが生成するファイル」を対象に削除を行います。

#### タスク `copy`
```sh
npm run copy:dev  # 開発環境用
npm run copy:stg  # テスト環境用
npm run copy:prd  # 本番環境用
```
`static` 以下のデータを `dist/[環境ディレクトリ]` へコピーします。  
`dist` 以下のデータは全てタスクランナーから出力されるデータであり、__`dist` 以下を直接変更してはいけません。__  
`src` 以下からの出力の対象外のファイルは全て `static` ディレクトリに格納し、`copy` コマンドによってデータを同期してください。

また、`gulp/config.js` に定義されている `tasks.copy.replace` の設定によって、コピーと同時に文字列置換を行うことができます。
```js
tasks.copy.replace = {
  target: ['.js', '.css', '.html'],
  regex: [
    {
      pattern: /\[\[genRoot\]\]/g,
      replacement: domain[options.env] + contentsPath[options.env],
    },
    {
      pattern: /\[\[cdnRoot\]\]/g,
      replacement: cdn[options.env] + contentsPath[options.env],
    },
  ],
}
```
`target` が置換対象のファイル、 `regex` が置換の定義になります。  
上記の設定では、コピーと同時に `[[genRoot]]`  `[[cdnRoot]]` を設定したドメインとコンテンツパスに置き換えます。

#### タスク `build`
```sh
npm run build:dev  # 開発環境用
npm run build:stg  # テスト環境用
npm run build:prd  # 本番環境用
```

データクリア ＆ データコピー & 各種コンテンツ生成の一括処理を行います。  
つまり、タスクを `clean`,`copy`, `defaultTasks` で設定したタスク一式 の順に実行をします。

#### タスク `watch`
```sh
npm run watch
```
こちらのタスクは `dev` 環境のみ対象です。
Browser-Sync による ローカルサーバを立ち上げ、`src`, `static` 以下のデータ変更を監視します。  
該当ファイルに変更があれば 必要に応じて `defaultTasks` で設定されたタスクを実行して Live Reload を行います。
