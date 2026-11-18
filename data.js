/* 기업 정보 — 여기만 고치면 5개 페이지에 모두 반영됩니다.
   logo: images 폴더 안 파일명 (없으면 null → 회색 LOGO 자리 표시)
   ko / en: 소개 문구. 줄바꿈 없이 그냥 이어서 쓰면 됩니다.
   enabled: 파트너 페이지 폴더를 눌렀을 때 열릴지 여부 */
window.ZONES = {
  "ai-service": {
    title: "AI·디지털정부 서비스",
    enabled: true,
    companies: [
      {
        name: "솔리데오",
        en: "SOLIDEO",
        logo: "logo_solideo.png",
        ko: "솔리데오는 행정서비스와 공공기관 행정시스템을 구축・연계・운영하는 AI · 디지털정부 전문기업 입니다. 정부24・전자증면서부터 행정정보 공동이용・공공 마이데이터까지, 디지털 행정의 기반을 만들어갑니다.",
        en_desc: "Solideo is a AI · digital government specialist that builds, connects and operates public services and administrative systems. From Government24 and e-Certificates to data sharing and Public MyData, it builds the foundation of AI · digital administration."
      },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  },
  "ai-innovation": {
    title: "AI혁신기술",
    enabled: false,
    companies: [
      { name: "기업 1", en: "COMPANY 1", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  },
  "digital-infra": {
    title: "디지털인프라",
    enabled: false,
    companies: [
      { name: "기업 1", en: "COMPANY 1", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  },
  "best-service": {
    title: "베스트서비스",
    enabled: false,
    companies: [
      { name: "기업 1", en: "COMPANY 1", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 2", en: "COMPANY 2", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." },
      { name: "기업 3", en: "COMPANY 3", logo: null, ko: "기업 소개 문구가 들어갈 자리입니다.", en_desc: "Company description goes here." }
    ]
  }
};

/* 메뉴 순서와 연결될 파일 */
window.PAGES = [
  { label: "AI·디지털정부 서비스", href: "ai-service.html" },
  { label: "AI혁신기술", href: "ai-innovation.html" },
  { label: "디지털인프라", href: "digital-infra.html" },
  { label: "베스트서비스", href: "best-service.html" },
  { label: "함께하는 AI·디지털정부 파트너", href: "partners.html" }
];
