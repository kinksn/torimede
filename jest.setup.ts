// このファイルでは各テストファイルが実行されるセットアップコードを定義している
// グローバルなモックやカスタムマッチャーはここで設定する

// @testing-library/jest-domをインポートしてカスタムマッチャーを使用可能にする
import "@testing-library/jest-dom";
// テスト環境で fetch が使えるように
import "isomorphic-fetch";

// 必要に応じて、他のセットアップコードを追加できます
// 例: モックの設定やグローバル設定
// jest.mock('module_name', () => {
//   return {
//     ...jest.requireActual('module_name'),
//     functionName: jest.fn(),
//   };
// });

// Next.jsのNextResponseオブジェクトのモックを設定
// これにより、NextResponse.jsonメソッドが特定の動作をシミュレートするようにカスタマイズされる
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => {
      return {
        ok: init?.status >= 200 && init?.status < 300,
        status: init?.status,
        json: async () => data,
      };
    }),
  },
}));
