import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VakalarPage from '@/app/vakalar/page'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Vakalar Sayfasi', () => {
  // --- ILK RENDER ---

  it('varsayilan olarak tum 5 vakay listeler', () => {
    render(<VakalarPage />)
    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-002')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-003')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-004')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-005')).toBeInTheDocument()
  })

  it('sayfa basligini render eder', () => {
    render(<VakalarPage />)
    expect(screen.getByRole('heading', { name: /Kayıp İlanları/i })).toBeInTheDocument()
  })

  it('filtre sekmeleri gorunur', () => {
    render(<VakalarPage />)
    expect(screen.getByRole('button', { name: /Tümü/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Aktif/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Bulundu/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Kapatıldı/ })).toBeInTheDocument()
  })

  it('arama kutusu render edilir', () => {
    render(<VakalarPage />)
    expect(
      screen.getByPlaceholderText(/Vaka ID, konum veya etiket ara/i)
    ).toBeInTheDocument()
  })

  // --- ISTATISTIK KARTLARI ---
  // Her stat kart: <div><div>{sayi}</div><div>{etiket}</div></div>
  // `within` ile kart icindeki sayiyi okuyoruz

  it('Toplam Vaka karti 5 gosterir', () => {
    render(<VakalarPage />)
    const label = screen.getByText('Toplam Vaka')
    const card = label.closest('div[class*="rounded"]') as HTMLElement
    expect(within(card).getByText('5')).toBeInTheDocument()
  })

  it('Bulundu karti 1 gosterir', () => {
    render(<VakalarPage />)
    // "Bulundu" stat etiketini bul (sekme butonlarindaki "Bulundu"dan farkli)
    const bulunduLabels = screen.getAllByText('Bulundu')
    // Stat karttaki label, butondaki metinden farkli class'a sahip
    const statLabel = bulunduLabels.find(
      (el) => el.className.includes('uppercase') && el.className.includes('tracking-widest')
    )
    expect(statLabel).toBeTruthy()
    const card = statLabel!.closest('div[class*="rounded"]') as HTMLElement
    expect(within(card).getByText('1')).toBeInTheDocument()
  })

  it('Kapatiildi karti 1 gosterir', () => {
    render(<VakalarPage />)
    const kapatildiLabels = screen.getAllByText('Kapatıldı')
    const statLabel = kapatildiLabels.find(
      (el) => el.className.includes('uppercase') && el.className.includes('tracking-widest')
    )
    expect(statLabel).toBeTruthy()
    const card = statLabel!.closest('div[class*="rounded"]') as HTMLElement
    expect(within(card).getByText('1')).toBeInTheDocument()
  })

  // --- SEKME FILTRELEME ---

  it('Aktif sekmesi yalnizca aktif vakalari gosterir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.click(screen.getByRole('button', { name: /^Aktif/ }))

    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-003')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-005')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-002')).not.toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-004')).not.toBeInTheDocument()
  })

  it('Bulundu sekmesi yalnizca bulunan vakalari gosterir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.click(screen.getByRole('button', { name: /^Bulundu/ }))

    expect(screen.getByText('VAKA-2026-002')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-001')).not.toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-003')).not.toBeInTheDocument()
  })

  it('Kapatiildi sekmesi yalnizca kapali vakalari gosterir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.click(screen.getByRole('button', { name: /^Kapatıldı/ }))

    expect(screen.getByText('VAKA-2026-004')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-001')).not.toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-002')).not.toBeInTheDocument()
  })

  it('Tumu sekmesi tum vakalari geri getirir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.click(screen.getByRole('button', { name: /^Aktif/ }))
    await user.click(screen.getByRole('button', { name: /^Tümü/ }))

    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-002')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-004')).toBeInTheDocument()
  })

  // --- ARAMA ---

  it('vaka ID ile arama yapilabilir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.type(screen.getByPlaceholderText(/Vaka ID, konum/i), '001')

    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-002')).not.toBeInTheDocument()
  })

  it('konuma gore arama yapilabilir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.type(screen.getByPlaceholderText(/Vaka ID, konum/i), 'Beşiktaş')

    expect(screen.getByText('VAKA-2026-003')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-001')).not.toBeInTheDocument()
  })

  it('etikete gore arama yapilabilir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    // Gercek Turkce karakterlerle etiket araniyor (#kirmizi_mont)
    await user.type(screen.getByPlaceholderText(/Vaka ID, konum/i), 'k\u0131rm\u0131z\u0131_mont')

    // Yalnizca VAKA-001'de #kirmizi_mont etiketi var
    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    // Diger vakalarda bu etiket yok, gozukmemeli
    expect(screen.queryByText('VAKA-2026-002')).not.toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-003')).not.toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-005')).not.toBeInTheDocument()
  })

  it('aciklamaya gore arama yapilabilir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.type(screen.getByPlaceholderText(/Vaka ID, konum/i), 'Alzheimer')

    expect(screen.getByText('VAKA-2026-003')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-001')).not.toBeInTheDocument()
  })

  it('sonuc yoksa sonuc bulunamadi mesaji gosterilir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.type(
      screen.getByPlaceholderText(/Vaka ID, konum/i),
      'xyz_eslesmeyen_metin_12345'
    )

    expect(screen.getByText(/Sonuç bulunamadı/i)).toBeInTheDocument()
  })

  // --- SEKME + ARAMA KOMBINASYONU ---

  it('aktif sekme ve arama birlikte calisir', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.click(screen.getByRole('button', { name: /^Aktif/ }))
    await user.type(screen.getByPlaceholderText(/Vaka ID, konum/i), 'Kadıköy')

    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    // VAKA-002 bulundu (aktif degil), VAKA-003 aktif ama Kadikoy degil
    expect(screen.queryByText('VAKA-2026-002')).not.toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-003')).not.toBeInTheDocument()
  })

  // --- KART ICERIGI ---

  it('aktif vakalar kart olarak listelenir', () => {
    render(<VakalarPage />)
    expect(screen.getByText('VAKA-2026-001')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-003')).toBeInTheDocument()
    expect(screen.getByText('VAKA-2026-005')).toBeInTheDocument()
  })

  it('kapali vakalar Aktif sekmesinde gozukmez', async () => {
    const user = userEvent.setup()
    render(<VakalarPage />)

    await user.click(screen.getByRole('button', { name: /^Kapatıldı/ }))

    expect(screen.getByText('VAKA-2026-004')).toBeInTheDocument()
    expect(screen.queryByText('VAKA-2026-001')).not.toBeInTheDocument()
  })

  it('fotografli vakalar Fotografli badge gosterir', () => {
    render(<VakalarPage />)
    const fotograflilar = screen.getAllByText(/Fotoğraflı/i)
    expect(fotograflilar).toHaveLength(2)
  })

  it('oncelik seviyeleri dogru gosterilir', () => {
    render(<VakalarPage />)
    expect(screen.getAllByText('Kritik').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Yüksek').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Normal')).toBeInTheDocument()
  })
})
