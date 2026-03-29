import { describe, it, expect, vi, beforeEach } from 'vitest'

// gemini modülünü gerçek API çağrısı yapmadan taklit ediyoruz
vi.mock('@/lib/gemini', () => ({
  geminiModel: {
    generateContent: vi.fn(),
  },
}))

import { POST } from '@/app/api/analyze/route'
import { geminiModel } from '@/lib/gemini'

// Test kolaylığı için Request nesnesi oluşturucu
function makeRequest(body: object) {
  return new Request('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// Gemini'den başarılı yanıt simüle eden yardımcı
function mockGeminiSuccess(payload: { tags: string[]; routePredictions: string[] }) {
  vi.mocked(geminiModel.generateContent).mockResolvedValueOnce({
    response: { text: () => JSON.stringify(payload) },
  } as any)
}

describe('POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── DOĞRULAMA ────────────────────────────────────────────────────────────

  it('açıklama (description) eksikse 400 döner', async () => {
    const res = await POST(makeRequest({ location: 'İstanbul' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Description is required')
  })

  it('açıklama boş string ise 400 döner', async () => {
    const res = await POST(makeRequest({ description: '', location: 'İstanbul' }))
    expect(res.status).toBe(400)
  })

  // ─── BAŞARILI YANIT ───────────────────────────────────────────────────────

  it('başarılı analizde 200 ve doğru alanlar döner', async () => {
    mockGeminiSuccess({
      tags: ['#kırmızı_mont', '#1.70_boy'],
      routePredictions: ['Metro istasyonuna yönelmiş olabilir.'],
    })

    const res = await POST(
      makeRequest({ description: 'Kırmızı montlu biri gördüm', location: 'İstanbul, Kadıköy' })
    )
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.tags).toContain('#kırmızı_mont')
    expect(body.tags).toContain('#1.70_boy')
    expect(body.routePredictions[0]).toContain('Metro')
  })

  it('yanıt originalText ve location alanlarını içerir', async () => {
    mockGeminiSuccess({ tags: [], routePredictions: [] })

    const res = await POST(
      makeRequest({ description: 'Test açıklama metni', location: 'Ankara' })
    )
    const body = await res.json()
    expect(body.originalText).toBe('Test açıklama metni')
    expect(body.location).toBe('Ankara')
  })

  it('konum girilmezse location "Belirtilmedi" olarak döner', async () => {
    mockGeminiSuccess({ tags: [], routePredictions: [] })

    const res = await POST(makeRequest({ description: 'Konum verilmeden ihbar' }))
    const body = await res.json()
    expect(body.location).toBe('Belirtilmedi')
  })

  // ─── MARKDOWN TEMİZLEME ───────────────────────────────────────────────────

  it('Gemini markdown kod bloğu gönderirse temizlenip parse edilir', async () => {
    vi.mocked(geminiModel.generateContent).mockResolvedValueOnce({
      response: {
        text: () =>
          '```json\n{"tags":["#mavi_mont"],"routePredictions":["Sahile yöneldi."]}\n```',
      },
    } as any)

    const res = await POST(makeRequest({ description: 'Mavi montlu biri gördüm' }))
    const body = await res.json()
    expect(body.tags).toContain('#mavi_mont')
    expect(body.routePredictions[0]).toBe('Sahile yöneldi.')
  })

  it('geri tikler (``` json) olmadan da doğru parse edilir', async () => {
    vi.mocked(geminiModel.generateContent).mockResolvedValueOnce({
      response: {
        text: () => '{"tags":["#sarı_şapka"],"routePredictions":["İskeleye doğru."]}\n',
      },
    } as any)

    const res = await POST(makeRequest({ description: 'Sarı şapkalı biri' }))
    const body = await res.json()
    expect(body.tags).toContain('#sarı_şapka')
  })

  // ─── GERİ DÖNÜŞ (FALLBACK) ────────────────────────────────────────────────

  it('Gemini geçersiz JSON döndürünce fallback mekanizması çalışır', async () => {
    vi.mocked(geminiModel.generateContent).mockResolvedValueOnce({
      response: { text: () => 'Bu geçerli bir JSON değil.' },
    } as any)

    const res = await POST(makeRequest({ description: 'Test ihbarı' }))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.routePredictions).toContain(
      'AI yorumu otonom olarak parçalanamadı, ancak veriler kaydedildi.'
    )
  })

  it('fallback durumunda # içeren kelimeler etiket olarak çıkarılır', async () => {
    vi.mocked(geminiModel.generateContent).mockResolvedValueOnce({
      response: {
        text: () => '#kırmızı_mont, #siyah_şapka, düz metin içeriği',
      },
    } as any)

    const res = await POST(makeRequest({ description: 'Test' }))
    const body = await res.json()
    expect(body.tags.some((t: string) => t.includes('#'))).toBe(true)
  })

  // ─── HATA YÖNETİMİ ───────────────────────────────────────────────────────

  it('Gemini API hata fırlatırsa 500 döner', async () => {
    vi.mocked(geminiModel.generateContent).mockRejectedValueOnce(
      new Error('Gemini API quota exceeded')
    )

    const res = await POST(makeRequest({ description: 'Test ihbarı' }))
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body.error).toBe('Failed to analyze description')
  })

  it('ağ hatası durumunda da 500 döner', async () => {
    vi.mocked(geminiModel.generateContent).mockRejectedValueOnce(
      new Error('Network error')
    )

    const res = await POST(makeRequest({ description: 'Test ihbarı' }))
    expect(res.status).toBe(500)
  })
})
