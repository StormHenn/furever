const KEY = 'furever:avatar'
const MAX_DIM = 320
const QUALITY = 0.82

export function loadAvatar(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function saveAvatar(value: string | null): void {
  try {
    if (value) localStorage.setItem(KEY, value)
    else localStorage.removeItem(KEY)
  } catch {
    // storage unavailable or over quota — keep the in-memory photo, skip persistence
  }
}

// Read a picked image file and downscale it to a small JPEG data-URL so it
// comfortably fits localStorage's ~5MB budget.
export function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas unavailable'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', QUALITY))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
