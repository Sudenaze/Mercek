import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IhbarPage from '@/app/ihbar/page'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

/**
 * Formu fireEvent ile doldur ve gonder.
 * userEvent.type React 19 + Vitest 4 kombinasyonunda
 * async act() sinirlarini asabiliyor; fireEvent daha guvenilir.
 */
function submitForm(description: string, location = '') {
  if (location) {
    const locInput = screen.getByPlaceholderText(/İstanbul, Kadıköy/i)
    fireEvent.change(locInput, { target: { value: location } })
  }
  const textarea = screen.getByPlaceholderText(/Örn: Mavi kot/i)
  fireEvent.change(textarea, { target: { value: description } })
  const form = textarea.closest('form')!
  fireEvent.submit(form)
}

describe('Ihbar Formu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('alert', vi.fn())
  })

  afterEach(() => {
    cleanup()
  })

  // --- RENDER ---

  it('form alanlarini render eder', () => {
    render(<IhbarPage />)
    expect(screen.getByLabelText(/Konum/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Olayın/i)).toBeInTheDocument()
    expect(screen.getByText(/Fotoğraf Yükle/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /İhbarı Bildir/i })).toBeInTheDocument()
  })

  it('navigasyon linklerini render eder', () => {
    render(<IhbarPage />)
    expect(screen.getByText(/Ana Sayfaya Dön/i)).toBeInTheDocument()
  })

  it('sidebar ipuclarini render eder', () => {
    render(<IhbarPage />)
    expect(screen.getByText(/Önemli Uyarı/i)).toBeInTheDocument()
    expect(screen.getByText(/İpuçları/i)).toBeInTheDocument()
    expect(screen.getByText(/Ne Olacak/i)).toBeInTheDocument()
  })

  // --- FORM DOGRULAMA ---

  it('aciklama boskken gonder butonu devre disidir', () => {
    render(<IhbarPage />)
    expect(screen.getByRole('button', { name: /İhbarı Bildir/i })).toBeDisabled()
  })

  it('aciklama doldurulunca gonder butonu aktif olur', async () => {
    const user = userEvent.setup()
    render(<IhbarPage />)
    await user.type(screen.getByPlaceholderText(/Örn: Mavi kot/i), 'Test ihbar metni')
    expect(screen.getByRole('button', { name: /İhbarı Bildir/i })).toBeEnabled()
  })

  it('aciklama yalnizca bosluk iceriyorsa gonder butonu devre disi kalir', async () => {
    const user = userEvent.setup()
    render(<IhbarPage />)
    await user.type(screen.getByPlaceholderText(/Örn: Mavi kot/i), '   ')
    expect(screen.getByRole('button', { name: /İhbarı Bildir/i })).toBeDisabled()
  })

  it('konum alanina yazilan deger guncellenir', async () => {
    const user = userEvent.setup()
    render(<IhbarPage />)
    const locationInput = screen.getByPlaceholderText(/İstanbul, Kadıköy/i)
    await user.type(locationInput, 'Ankara, Cankaya')
    expect(locationInput).toHaveValue('Ankara, Cankaya')
  })

  // --- FOTOGRAF YUKLEME ---

  it('dosya giris alani yalnizca PNG ve JPG kabul eder', () => {
    render(<IhbarPage />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toHaveAttribute('accept', 'image/png, image/jpeg, image/jpg')
  })

  it('fotograf secilince dosya adi gosterilir', async () => {
    const user = userEvent.setup()
    render(<IhbarPage />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const fakeFile = new File(['img-content'], 'sahil_foto.jpg', { type: 'image/jpeg' })
    await user.upload(fileInput, fakeFile)
    expect(screen.getByText('sahil_foto.jpg')).toBeInTheDocument()
  })

  it('fotograf secilmeden once yukleme talimati gorunur', () => {
    render(<IhbarPage />)
    expect(screen.getByText(/Yüklemek için tıklayın/i)).toBeInTheDocument()
    expect(screen.getByText(/PNG, JPG/i)).toBeInTheDocument()
  })

  it('ikinci fotograf seciminde yalnizca sonuncu gosterilir', async () => {
    const user = userEvent.setup()
    render(<IhbarPage />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, new File(['a'], 'ilk.jpg', { type: 'image/jpeg' }))
    expect(screen.getByText('ilk.jpg')).toBeInTheDocument()

    await user.upload(fileInput, new File(['b'], 'ikinci.png', { type: 'image/png' }))
    expect(screen.getByText('ikinci.png')).toBeInTheDocument()
    expect(screen.queryByText('ilk.jpg')).not.toBeInTheDocument()
  })

  // --- FORM GONDERIMI (fireEvent — React 19 + Vitest 4 icin guvenilir) ---

  it('fetch dogru parametrelerle cagirilir', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, tags: [], routePredictions: [] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    render(<IhbarPage />)
    submitForm('Kirmizi montlu biri gordum', 'Istanbul, Kadikoy')

    expect(mockFetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Kirmizi montlu biri gordum',
        location: 'Istanbul, Kadikoy',
      }),
    })
    await screen.findByText(/İhbarınız Alındı/i, undefined, { timeout: 5000 })
  })

  it('gonderim sirasinda yukleme mesaji gorulur', async () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))

    render(<IhbarPage />)
    submitForm('Test ihbari')

    await waitFor(() => {
      expect(screen.getByText(/Yapay Zeka Analiz Ediyor/i)).toBeInTheDocument()
    })
  })

  it('basarili gonderim sonrasi basari ekrani gosterilir', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, tags: ['#test'], routePredictions: [] }),
    }))

    render(<IhbarPage />)
    submitForm('Test ihbari')

    expect(
      await screen.findByText(/İhbarınız Alındı/i, undefined, { timeout: 5000 })
    ).toBeInTheDocument()
  })

  it('Yeni Ihbar Yap butonuna basinca form sifirlaniir', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, tags: [], routePredictions: [] }),
    }))

    render(<IhbarPage />)
    submitForm('Test ihbari')

    await screen.findByText(/İhbarınız Alındı/i, undefined, { timeout: 5000 })
    await user.click(screen.getByRole('button', { name: /Yeni İhbar Yap/i }))

    expect(screen.getByRole('button', { name: /İhbarı Bildir/i })).toBeInTheDocument()
    expect(screen.queryByText(/İhbarınız Alındı/i)).not.toBeInTheDocument()
  })

  it('basarili gonderim sonrasi form alanlari temizlenir', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, tags: [], routePredictions: [] }),
    }))

    render(<IhbarPage />)
    submitForm('Test ihbari', 'Kadikoy')

    await screen.findByText(/İhbarınız Alındı/i, undefined, { timeout: 5000 })
    await user.click(screen.getByRole('button', { name: /Yeni İhbar Yap/i }))

    expect(screen.getByPlaceholderText(/İstanbul, Kadıköy/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/Örn: Mavi kot/i)).toHaveValue('')
  })

  it('API hatasi durumunda alert gosterilir', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }))

    render(<IhbarPage />)
    submitForm('Test ihbari')

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Bir hata oluştu. Lütfen tekrar deneyin.')
    }, { timeout: 5000 })
  })

  it('API hatasi sonrasinda form tekrar kullanilabilir kalir', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }))

    render(<IhbarPage />)
    submitForm('Test ihbari')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /İhbarı Bildir/i })).toBeEnabled()
    }, { timeout: 5000 })
  })
})
