import { TypeInfo } from './types.ts';
import { Context, Hono } from "https://deno.land/x/hono@v3.0.0/mod.ts";
import Infos from "./info.json" assert { type: "json" };

// 後でany外す
const infos: TypeInfo[] = Infos.baka; // ここに info.json 飯食ってくる ほかにも颯化した奴、する予定の奴追加頼む by amex

const app: Hono = new Hono();

// メインページ
app.get("/", (c: Context) => {
  return c.html("<b>test!</b>");
});

// koko 動的にしよう
// /植田大輝でアクセス
//植田とか河野の名前入れたらjson来るようにする？ un 飯食う
app.all("/api/v1/:name", (c: Context) => {
  const name: string = c.req.param("name") ?? ""; // /[name] のnameが渡される ここでjson返すか それともレンダリングするか

  const info = infos.find((info: TypeInfo) => {
    if (info["名前"] === name) {
        return true;
    }
  })

  if (typeof info == "undefined") {
    return c.json({
        "result": "Error"
    })
  }

  return c.json({
    "result": "Success",
    ...info
  });
});

const { serve } = Deno;

serve((req: Request, connInfo) => {
  const envs = {
    ctx: connInfo,
  };
  return app.fetch(req, envs);
});

// 共同開発メモ
// https://ubiquitous-carnival-qr675jg5xwq24j6x-8000.app.github.dev/
// ここでコード変えるたびにリアルタイム更新される
// 今さ info.jsonを作るから そこに河野颯太と植田大輝の情報を書いて欲しい
// 飯なう
//こんにちは evoraや
//ちゃんとevoraになってる？ うん
// ターミナル使えるようにした