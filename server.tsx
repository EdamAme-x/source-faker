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
        <body>
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 40"
              x="0px"
              y="0px"
            >
              <g data-name="5">
                <path d="M9,9a7,7,0,1,1,7,7A7,7,0,0,1,9,9Zm18.67,9a5.11,5.11,0,0,0-5-4,1,1,0,0,0-.74.33,8,8,0,0,1-11.9,0A1,1,0,0,0,9.31,14a5.11,5.11,0,0,0-5,4L2,28.79A1,1,0,0,0,3,30H29a1,1,0,0,0,1-1.21Z" />
              </g>
            </svg>
          </div>
          <div className="infos">
            <h1>{result["名前"]}</h1>
            <h4>{result["別名"]}</h4>
            <h6>出身地: {result["出身地"]}</h6>
            <h6>年齢: {result["年齢"] + 2}歳 (2021年当時)</h6>
            <h6>身長: {result["身長"]}cm</h6>
            <h6>生年月日: {result["生年月日"]}</h6>
            <h6>備考: {result["情報"]}</h6>
          </div>
          <style>
            {`
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100vw;
              height: 100vh;
              overflow-x: hidden;
            }

            .icon {
              max-width: 300px;
              width: 300px;
            }

            .infos { 
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            .infos * {
              margin: 0;
            }

            .infos h6 {
              margin-top: 20px;
            }
            `}
          </style>
        </body>
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
