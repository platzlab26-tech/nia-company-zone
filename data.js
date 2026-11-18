/* 기업 정보 — 여기만 고치면 5개 페이지에 모두 반영됩니다.
   logo: images 폴더 안 파일명 (없으면 null → 회색 LOGO 자리 표시)
   ko / en: 소개 문구. 줄바꿈 없이 그냥 이어서 쓰면 됩니다.
   enabled: 파트너 페이지 폴더를 눌렀을 때 열릴지 여부
   title_en: 영어 화면에서 폴더에 나오는 이름 */
window.ZONES = {
  "ai-service": {
    title: "AI·디지털정부 서비스",
    title_en: "AI & Digital Government Services",
    enabled: true,
    companies: [
      {
        name: "솔리데오",
        en: "SOLIDEO",
        logo: "logo_solideo.png",
        ko: "솔리데오는 행정서비스와 공공기관 행정시스템을 구축・연계・운영하는 AI · 디지털정부 전문기업 입니다. 정부24・전자증면서부터 행정정보 공동이용・공공 마이데이터까지, 디지털 행정의 기반을 만들어갑니다.",
        en_desc: "Solideo is an AI & digital government specialist that builds, connects and operates public services and the administrative systems of public institutions. From Government24 and e-Certificates to administrative data sharing and Public MyData, it lays the foundation for digital administration."
      },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  },
  "ai-innovation": {
    title: "AI혁신기술",
    title_en: "AI Innovation Technology",
    enabled: false,
    companies: [
      { name: "기업 1", en: "COMPANY 1", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  },
  "digital-infra": {
    title: "디지털인프라",
    title_en: "Digital Infrastructure",
    enabled: false,
    companies: [
      { name: "기업 1", en: "COMPANY 1", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  },
  "best-service": {
    title: "베스트서비스",
    title_en: "Best Service",
    enabled: false,
    companies: [
      { name: "기업 1", en: "COMPANY 1", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  }
};

/* 메뉴 순서와 연결될 파일 (en: 영어 버튼을 눌렀을 때 메뉴·제목에 나오는 이름) */
window.PAGES = [
  { label: "AI·디지털정부 서비스", en: "AI & Digital Government Services", href: "ai-service.html" },
  { label: "AI혁신기술", en: "AI Innovation Technology", href: "ai-innovation.html" },
  { label: "디지털인프라", en: "Digital Infrastructure", href: "digital-infra.html" },
  { label: "베스트서비스", en: "Best Service", href: "best-service.html" },
  { label: "함께하는 AI·디지털정부 파트너", en: "Our AI & Digital Government Partners", href: "partners.html" }
];
