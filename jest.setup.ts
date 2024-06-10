// @testing-library/jest-domをインポートしてカスタムマッチャーを使用可能にする
import "@testing-library/jest-dom";
import "isomorphic-fetch";

// 必要に応じて、他のセットアップコードを追加できます
// 例: モックの設定やグローバル設定
// jest.mock('module_name', () => {
//   return {
//     ...jest.requireActual('module_name'),
//     functionName: jest.fn(),
//   };
// });

// NextResponseのモック
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
