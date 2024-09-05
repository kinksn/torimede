export const unique = <T>(array: T[]): T[] => {
  try {
    // シリアライズ可能なデータ型のみを扱うことを前提とする
    const unique = new Set(array.map((item) => JSON.stringify(item)));
    return [...unique].map((item) => JSON.parse(item));
  } catch (error) {
    // シリアライズエラーが発生した場合は空の配列を返す
    console.error("function unique error. ", error);
    return [];
  }
};
