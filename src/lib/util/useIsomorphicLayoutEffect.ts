import { useLayoutEffect, useEffect } from "react";

// window オブジェクトが存在するかどうかをチェックし、クライアントサイドであれば useLayoutEffect を、サーバーサイドであれば useEffect を使用
// これにより、サーバーサイドレンダリング（SSR）環境でも問題なく動作するように
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
