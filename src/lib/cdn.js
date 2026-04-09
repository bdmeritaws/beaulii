export function getImageBaseUrl() {
  return process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
}

export function getImageUrl(path) {
  if (!path) return '';
  
  const baseUrl = getImageBaseUrl();
  
  if (path.startsWith('http')) {
    return path.replace('babshahi.s3', 'beaulii.s3').replace('https:/', 'https://');
  }
  
  const cleanPath = path?.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}/${cleanPath}`.replace(/\/+/g, '/').replace('https:/', 'https://');
}

export function getCdnPath(folder, filename) {
  return `${folder}/${filename}`;
}

export default {
  getImageBaseUrl,
  getImageUrl,
  getCdnPath,
};
