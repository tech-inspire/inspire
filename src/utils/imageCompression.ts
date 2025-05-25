export async function compressImage(
  file: File,
  maxSize = 1600,
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await createImageBitmap(file)

  let { width, height } = img
  if (width > maxSize || height > maxSize) {
    const scale = maxSize / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob>(
    (resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8), // adjust quality here
  )

  return { blob, width, height }
}
