export interface MatchedReport {
  reportId: string
  matchScore: number
  matchedTags: string[]
  unmatchedTags: string[]
  location: string
  timestamp: string
  summary: string
}

export interface MissingPerson {
  id: string
  name: string
  initials: string
  age: number
  gender: string
  hasPhoto: boolean

  // Fiziksel özellikler
  height: string
  build: string
  hairColor: string
  eyeColor: string
  distinguishingFeatures: string
  lastSeenClothing: string

  // Kaybolma bilgileri
  lastSeenDate: string
  lastSeenTime: string
  lastSeenLocation: string
  coordinates: [number, number]
  circumstances: string

  // Aile/bildiren
  reportedBy: string
  contactPhone: string

  // Durum
  status: "Aktif" | "Bulundu" | "Kapatıldı"
  priority: "Kritik" | "Yüksek" | "Normal"
  openedDate: string
  closedDate?: string

  // Eşleşen ihbarlar
  matchedReports: MatchedReport[]
}

export const mockPersons: MissingPerson[] = [
  {
    id: "VAKA-2026-001",
    name: "Umut Koçak",
    initials: "U.K.",
    age: 8,
    gender: "Erkek Çocuğu",
    hasPhoto: false,
    height: "1.25 m",
    build: "İnce yapılı",
    hairColor: "Kısa, siyah",
    eyeColor: "Kahverengi",
    distinguishingFeatures: "Ağır otizm tanısı var. Sözel iletişimi yok; adını ve adresini söyleyemiyor. Stres altında yerinde sallanma davranışı gösterebilir.",
    lastSeenClothing: "Kırmızı mont, gri kapüşonlu sweatshirt, lacivert eşofman altı, beyaz spor ayakkabı",
    lastSeenDate: "2026-03-27",
    lastSeenTime: "15:45",
    lastSeenLocation: "İstanbul, Kadıköy, Moda Parkı",
    coordinates: [40.9874, 29.0251],
    circumstances:
      "Babası ile Moda Parkı'nda yürüyüş yapıyordu. Baba tuvaletten döndüğünde yaklaşık 3 dakika içinde oğlunu bulamadı. Otistik bireyler genellikle su, ışık veya araç trafiği gibi uyaranlara doğru yönelebilmekte; tehlikeye karşı farkındalıkları düşük olabilmektedir. Bölgedeki hastaneler ve karakollar bilgilendirildi.",
    reportedBy: "Babası",
    contactPhone: "0533 *** 4421",
    status: "Aktif",
    priority: "Kritik",
    openedDate: "2026-03-27T16:00:00Z",
    matchedReports: [
      {
        reportId: "REP-001",
        matchScore: 91,
        matchedTags: ["#kırmızı_mont", "#kadıköy_moda", "#çocuk", "#siyah_saçlı", "#8-9_yaş"],
        unmatchedTags: ["#ağlıyor"],
        location: "İstanbul, Kadıköy, Moda Sahili",
        timestamp: "2026-03-27T15:55:00Z",
        summary:
          "Moda sahil yolunda kırmızı montlu, kısa siyah saçlı küçük bir erkek çocuğu tek başına yürüyordu. Etrafına bakmadan hızlıca ilerliyordu, kimseyle iletişim kurmuyordu. 7–8 yaşlarında görünüyordu.",
      },
      {
        reportId: "REP-002",
        matchScore: 74,
        matchedTags: ["#kırmızı_mont", "#çocuk", "#kadıköy"],
        unmatchedTags: ["#siyah_ayakkabı"],
        location: "İstanbul, Kadıköy, Moda Çıkmazı",
        timestamp: "2026-03-27T16:10:00Z",
        summary:
          "Kırmızı montlu küçük bir çocuk bir apartmanın girişinde bekliyordu. Kapıyı açmaya çalışıyordu, kimse yanında yoktu.",
      },
    ],
  },
  {
    id: "VAKA-2026-002",
    name: "Emine Doğan",
    initials: "E.D.",
    age: 74,
    gender: "Kadın",
    hasPhoto: true,
    height: "1.57 m",
    build: "Kilolu",
    hairColor: "Kısa, beyaz",
    eyeColor: "Kahverengi",
    distinguishingFeatures: "Alzheimer tanısı var. Adını söyleyebiliyor ancak nerede yaşadığını ve ailesinin telefon numarasını bilmiyor. Sol bileğinde sarı plastik tanı bileziği var.",
    lastSeenClothing: "Bordo hırka, siyah pantolon, kahverengi ev terliği",
    lastSeenDate: "2026-01-14",
    lastSeenTime: "07:20",
    lastSeenLocation: "İstanbul, Üsküdar, Doğancılar Parkı",
    coordinates: [41.0231, 29.0128],
    circumstances:
      "Sabah erken saatte bakıcısı uyurken apartmandan çıkmış. Alzheimer hastası bireyler genellikle eski alışkanlıklarına yönelmekte, eski ev veya işyerlerine gitmeye çalışabilmektedir. Emniyet kayıp bürosu ve çevre sağlık birimleri uyarıldı. Aynı gün öğleden önce çevredeki bir esnaf tarafından fark edilerek aileye ulaşıldı.",
    reportedBy: "Kızı",
    contactPhone: "0542 *** 8819",
    status: "Bulundu",
    priority: "Kritik",
    openedDate: "2026-01-14T08:00:00Z",
    closedDate: "2026-01-14T11:40:00Z",
    matchedReports: [
      {
        reportId: "REP-003",
        matchScore: 97,
        matchedTags: ["#üsküdar", "#beyaz_saçlı", "#yaşlı_kadın", "#bordo_hırka", "#sarı_bilezik"],
        unmatchedTags: [],
        location: "İstanbul, Üsküdar, Doğancılar",
        timestamp: "2026-01-14T08:10:00Z",
        summary:
          "Doğancılar Parkı girişinde beyaz saçlı, bordo hırkalı yaşlı bir kadın duruyordu. Sol bileğinde sarı bir bileklik vardı. Nereye gittiğini bilmediğini, evini bulamadığını söyledi. Çok şaşkın görünüyordu.",
      },
    ],
  },
  {
    id: "VAKA-2026-003",
    name: "Mustafa Çelik",
    initials: "M.Ç.",
    age: 79,
    gender: "Erkek",
    hasPhoto: true,
    height: "1.70 m",
    build: "Orta yapılı",
    hairColor: "Kısa, gri-beyaz",
    eyeColor: "Mavi",
    distinguishingFeatures: "Alzheimer hastası; adını söyleyebiliyor ancak adresini ve aile bireylerini tanımıyor. Sağ elinde yeşil tanı bileziği var. Sol bacağında hafif topallama mevcut.",
    lastSeenClothing: "Lacivert kaban, beyaz gömlek, bej pantolon, kahverengi bağcıklı ayakkabı",
    lastSeenDate: "2026-03-25",
    lastSeenTime: "09:15",
    lastSeenLocation: "İstanbul, Beşiktaş, Çarşı Meydanı",
    coordinates: [41.0425, 29.0042],
    circumstances:
      "Oğlu ile sabah yürüyüşündeydi. Oğlu bir dükkan vitrinini incelerken birkaç dakika içinde kayboldu. Alzheimer tanılı bireylerin kaybolduğu ilk altı saat kritik önem taşımaktadır. Beşiktaş çevresindeki eczaneler, kahvehaneler ve dükkânlar uyarıldı.",
    reportedBy: "Oğlu",
    contactPhone: "0555 *** 3372",
    status: "Aktif",
    priority: "Yüksek",
    openedDate: "2026-03-25T10:00:00Z",
    matchedReports: [
      {
        reportId: "REP-006",
        matchScore: 83,
        matchedTags: ["#beşiktaş", "#lacivert_kaban", "#yaşlı_erkek", "#topallıyor"],
        unmatchedTags: ["#adres_soruyor"],
        location: "İstanbul, Beşiktaş, Çarşı Meydanı",
        timestamp: "2026-03-25T11:40:00Z",
        summary:
          "Beşiktaş Çarşı'da lacivert kaban giyen, hafif topallayarak yürüyen yaşlı bir erkek dikkatimi çekti. Etrafına şaşkın bakıyordu, bir esnafa adres sorduğunu duydum ama anlatamadı.",
      },
    ],
  },
  {
    id: "VAKA-2026-004",
    name: "Selin Yıldız",
    initials: "S.Y.",
    age: 21,
    gender: "Kadın",
    hasPhoto: false,
    height: "1.63 m",
    build: "İnce yapılı",
    hairColor: "Uzun, açık kahverengi",
    eyeColor: "Yeşil",
    distinguishingFeatures: "Sol kulak memesinde küçük yıldız dövmesi, ince çerçeveli gözlük kullanıyor",
    lastSeenClothing: "Siyah mont, beyaz bluz, krem rengi pantolon, siyah spor ayakkabı",
    lastSeenDate: "2026-02-20",
    lastSeenTime: "22:00",
    lastSeenLocation: "İstanbul, Beyoğlu, İstiklal Caddesi",
    coordinates: [41.0335, 28.9773],
    circumstances:
      "Arkadaşlarıyla buluşmak için evden çıktı. İstiklal Caddesi'nden son mesajını attı. Üç gün sonra kendiliğinden aileyi aradı; güvende olduğunu bildirdi. Dava kapatıldı.",
    reportedBy: "Annesi",
    contactPhone: "0533 *** 6614",
    status: "Kapatıldı",
    priority: "Normal",
    openedDate: "2026-02-21T07:00:00Z",
    closedDate: "2026-02-24T14:30:00Z",
    matchedReports: [
      {
        reportId: "REP-004",
        matchScore: 72,
        matchedTags: ["#siyah_mont", "#uzun_saç", "#beyoğlu", "#genç_kadın"],
        unmatchedTags: ["#gözlüklü"],
        location: "İstanbul, Beyoğlu, İstiklal",
        timestamp: "2026-02-20T22:30:00Z",
        summary:
          "İstiklal Caddesi'nde siyah montlu, uzun açık kahverengi saçlı genç bir kadın gördüm. Telefona bakıyordu, biraz endişeli görünüyordu.",
      },
    ],
  },
  {
    id: "VAKA-2026-005",
    name: "Emre Kaya",
    initials: "E.K.",
    age: 26,
    gender: "Erkek",
    hasPhoto: false,
    height: "1.65 m",
    build: "Kilolu",
    hairColor: "Kısa, siyah",
    eyeColor: "Kahverengi",
    distinguishingFeatures: "Down sendromu tanısı var. Konuşabiliyor ve kendini tanıtabiliyor ancak adresini söyleyemiyor. Yabancılarla kolayca iletişim kurar. Sağ bileğinde turuncu spor saat var.",
    lastSeenClothing: "Kırmızı spor ceket, mavi kot pantolon, sarı spor ayakkabı, turuncu sırt çantası",
    lastSeenDate: "2026-03-28",
    lastSeenTime: "14:00",
    lastSeenLocation: "İstanbul, Pendik, Alışveriş Merkezi Önü",
    coordinates: [40.8768, 29.258],
    circumstances:
      "Annesiyle alışveriş merkezine gitti. Anne kasa sırasındayken kayboldu. Down sendromlu bireyler yabancılarla kolayca iletişime geçebildiğinden biriyle birlikte yürümüş olabileceği değerlendirilmektedir. AVM güvenlik kameraları inceleniyor.",
    reportedBy: "Annesi",
    contactPhone: "0544 *** 7723",
    status: "Aktif",
    priority: "Yüksek",
    openedDate: "2026-03-28T14:30:00Z",
    matchedReports: [
      {
        reportId: "REP-005",
        matchScore: 68,
        matchedTags: ["#kırmızı_spor_ceket", "#pendik", "#genç_erkek", "#sarı_ayakkabı"],
        unmatchedTags: ["#turuncu_çanta"],
        location: "İstanbul, Pendik, AVM Çevresi",
        timestamp: "2026-03-28T14:25:00Z",
        summary:
          "Pendik AVM önünde kırmızı spor ceket giymiş, sarı ayakkabılı bir genç erkek bir çift yaşlıyla samimi biçimde konuşuyordu. Ardından birlikte yürüyerek gözden kayboldu.",
      },
    ],
  },
]
