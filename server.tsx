/** @jsx React.createElement */
import { TypeInfo } from "./types.ts";
import { Context, Hono } from "https://deno.land/x/hono@v3.11.4/mod.ts";
import Infos from "./info.json" assert { type: "json" };
import React from "https://esm.sh/react@18.2.0";
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server";

const infos: TypeInfo[] = Infos.baka; // ここに info.json

const app: Hono = new Hono();

// /名前 でアクセス
app.all("/api/v1/:name", (c: Context) => {
  const name: string = c.req.param("name") ?? ""; // /[name] のnameが渡される

  const info = infos.find((info: TypeInfo) => {
    if (info["名前"] === name) {
      return true;
    }
  });

  if (typeof info == "undefined") {
    return c.json({
      result: "Error",
    });
  }

  return c.json({
    result: "Success",
    ...info,
  });
});

app.get("/:name", async (c: Context) => {
  const name: string = c.req.param("name") ?? "";

  const result: TypeInfo<{
    result: "Success" | "Error";
  }> = await (await app.request("/api/v1/" + name)).json();

  if (result.result === "Error") {
    // 偽造
    return c.text("Error Code: 500 USER.cgi | USER NOT FOUND");
  }

  // SEOはガン無視 必要であれば追加
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{result["名前"]}さんのプロフィール</title>
          <link rel="stylesheet" href="https://cdn.ame-x.net/site-auto.css" />
          <link rel="icon" href="https://cdn.ame-x.net/Xuery.png" />
        </head>
      </html>
    )
  );
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
// 見えてる？
