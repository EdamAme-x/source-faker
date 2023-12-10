// deno-lint-ignore-file
export type TypeInfo<T extends {
    [key: string]: unknown
} = {}> = {
    "名前": string,
    "年齢": number,
    "職業": string,
    "出身地": string,
    "生年月日": string,
    "別名": string,
    "身長": number,
    "情報": string
} & T