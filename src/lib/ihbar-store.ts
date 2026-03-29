export interface StoredIhbar {
  id: string
  timestamp: string
  location: string
  description: string
  tags: string[]
  routePredictions: string[]
  status: "Yeni" | "İnceleniyor"
  hasPhoto: boolean
  photoDataUrl?: string
  photoName?: string
  coordinates?: [number, number]
}

const STORAGE_KEY = "kesisim_ihbars"

export function getStoredIhbars(): StoredIhbar[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveIhbar(ihbar: StoredIhbar): void {
  const current = getStoredIhbars()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([ihbar, ...current]))
}

export function generateIhbarId(): string {
  const now = new Date()
  const yy = now.getFullYear().toString().slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const rand = Math.floor(Math.random() * 900) + 100
  return `REP-${yy}${mm}-${rand}`
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}
