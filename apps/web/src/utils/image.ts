export interface CompressImageOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

// Blob을 base64로 변환하는 함수
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 이미지 로드 함수
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// 이미지 압축 함수
export const compressImage = async (file: File, options: CompressImageOptions): Promise<Blob> => {
  const img = await loadImage(file);

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    // 이미지 리사이징
    if (options.maxWidth && width > options.maxWidth) {
      height = (height * options.maxWidth) / width;
      width = options.maxWidth;
    }
    if (options.maxHeight && height > options.maxHeight) {
      width = (width * options.maxHeight) / height;
      height = options.maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/webp',
      options.quality,
    );
  });
};
