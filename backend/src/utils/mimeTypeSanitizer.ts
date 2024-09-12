/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 *
 *
 * upload file zip di windows extensionnya bisa jadi beda2
 * perlu di sanitize dulu biar konsisten
 */

export function sanitizeMimeType(mimeType: string) {
  const mimeTypeToExtension: Record<string, string> = {
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
    "multipart/x-zip":'zip',
    'application/vnd.rar': 'rar',
    'application/x-rar-compressed': 'rar',
    "application/octet-stream":'rar',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
    'image/png':'png',
    'application/pdf':'pdf'
  };
  const fileExt = mimeTypeToExtension[mimeType] || 'dat';

  return fileExt
}
