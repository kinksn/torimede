/**
 * DAO層でエラーハンドリングを行うユーティリティ関数
 * 指定されたコールバック（非同期関数）を実行する
 * エラーが発生した場合は引数`errorMessage`に指定したメッセージを加えて例外を投げる
 */
export const handleDaoError = async <T>(
  { errorMessage }: { errorMessage: string },
  callback: () => Promise<T>
): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`); // 元のエラーメッセージも含めてスロー
    } else {
      throw new Error(errorMessage);
    }
  }
};
