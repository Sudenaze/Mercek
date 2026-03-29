export interface StoredIlan {
  id: string
  timestamp: string
  name: string
  age: number
  gender: string
  hasPhoto: boolean
  photoDataUrl?: string
  photoName?: string
  height: string
  build: string
  hairColor: string
  eyeColor: string
  distinguishingFeatures: string
  lastSeenClothing: string
  lastSeenDate: string
  lastSeenTime: string
  lastSeenLocation: string
  circumstances: string
  reportedBy: string
  contactPhone: string
}

const STORAGE_KEY = "kesisim_ilanlar"

export function getStoredIlanlar(): StoredIlan[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") }
  catch { return [] }
}

export function saveIlan(ilan: StoredIlan): void {
  const current = getStoredIlanlar()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([ilan, ...current]))
}

export function generateIlanId(): string {
  const now = new Date()
  const yy = now.getFullYear().toString().slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const rand = Math.floor(Math.random() * 900) + 100
  return `VAKA-${yy}${mm}-${rand}`
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}
