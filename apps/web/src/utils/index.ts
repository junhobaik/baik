export const copyClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
  }
};
