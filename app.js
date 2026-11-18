(function () {
  var page = document.querySelector(".page");
  var current = location.pathname.split("/").pop() || "";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function img(src, cls) {
    var i = el("img", cls);
    i.src = src; i.alt = "";
    return i;
  }

  /* ---------- 언어 (KO / ENG) ---------- */
  var T = {
    ko: { brand: "AI · 디지털정부 전시관", back: "돌아가기", openMenu: "메뉴 열기", closeMenu: "메뉴 닫기",
          play: "영상 재생", companies: "참여 기업", video: " 소개 영상", lang: "언어 선택", logo: " 로고" },
    en: { brand: "AI & Digital Government Pavilion", back: "Back", openMenu: "Open menu", closeMenu: "Close menu",
          play: "Play video", companies: "Participating companies", video: " introduction video", lang: "Language", logo: " logo" }
  };
  var lang = "ko";
  var qLang = (location.search.match(/[?&]lang=(ko|en)/) || [])[1];
  try { lang = qLang || localStorage.getItem("nia-lang") || "ko"; } catch (err) { lang = qLang || "ko"; }
  if (!T[lang]) lang = "ko";

  /* ---------- 상단 바 + 메뉴 ---------- */
  var menu = el("div", "menu");
  var toggle = el("button", "menu-toggle");
  toggle.setAttribute("aria-expanded", "false");
  toggle.appendChild(img("images/icon_close.svg"));

  var brand = el("div", "brand");
  brand.appendChild(img("images/icon_flag.svg"));
  var brandText = el("span");
  brand.appendChild(brandText);

  var list = el("ul", "menu-list");
  var menuLinks = [];
  window.PAGES.forEach(function (p) {
    var li = el("li"), a = el("a");
    a.href = p.href;
    if (p.href === current) a.setAttribute("aria-current", "page");
    a.tabIndex = -1;
    menuLinks.push({ a: a, p: p });
    li.appendChild(a); list.appendChild(li);
  });

  var langBox = el("div", "lang");
  langBox.setAttribute("role", "group");
  var bKo = el("button", "lang-ko", "KO"), bEn = el("button", "lang-en", "ENG");
  bKo.type = bEn.type = "button";
  bKo.lang = "ko"; bEn.lang = "en";
  langBox.appendChild(bKo); langBox.appendChild(bEn);
  bKo.addEventListener("click", function () { setLang("ko"); });
  bEn.addEventListener("click", function () { setLang("en"); });

  menu.appendChild(toggle); menu.appendChild(brand); menu.appendChild(langBox); menu.appendChild(list);
  page.insertBefore(menu, page.firstChild);

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? T[lang].closeMenu : T[lang].openMenu);
    list.querySelectorAll("a").forEach(function (a) { a.tabIndex = open ? 0 : -1; });
  }
  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setMenu(!menu.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("open") && !menu.contains(e.target)) setMenu(false);
  });

  /* ---------- 영상: 재생 버튼을 누르면 캡처 이미지 자리에서 재생 ---------- */
  var hero = page.querySelector(".hero[data-video]");
  if (hero) {
    hero.querySelector(".play").addEventListener("click", function () {
      var poster = hero.querySelector("img");
      var v = document.createElement("video");
      v.src = hero.dataset.video;
      v.poster = poster.getAttribute("src");
      v.controls = true;
      v.playsInline = true;           /* 아이폰에서 전체화면으로 튀지 않게 */
      v.setAttribute("playsinline", "");
      v.preload = "auto";
      hero.appendChild(v);
      this.remove();
      var p = v.play();
      if (p && p.catch) p.catch(function () {}); /* 자동재생이 막혀도 컨트롤로 재생 가능 */
    });
  }

  /* ---------- 제목 양옆 캐릭터 ---------- */
  var cl = el("div", "char char-l"); cl.appendChild(img("images/characters.png"));
  var cr = el("div", "char char-r"); cr.appendChild(img("images/characters.png"));
  var title = page.querySelector(".section-title");
  page.insertBefore(cl, title); page.insertBefore(cr, title);
  var titleKo = title.textContent.trim();
  var titleText = el("span", "t");
  title.textContent = "";
  title.appendChild(titleText);
  var pageInfo = window.PAGES.filter(function (p) { return p.href === current; })[0];
  if (!pageInfo) { /* 주소가 index 등으로 열렸을 때: 영어 제목은 같은 이름의 메뉴에서 찾기 */
    var key = document.body.dataset.zone ? document.body.dataset.zone + ".html" : "partners.html";
    pageInfo = window.PAGES.filter(function (p) { return p.href === key; })[0] || {};
  }

  /* ---------- 기업 카드 ---------- */
  /* 무한 스와이프: 기업 목록을 7벌 이어 붙이고 가운데 벌에서 시작.
     스와이프가 멈출 때마다 같은 기업이 있는 가운데 벌로 몰래 되돌아가므로
     한 방향으로 계속 넘겨도 끝이 나오지 않습니다. */
  var COPIES = 7, MID = 3;
  function buildCarousel(carousel, companies) {
    carousel.innerHTML = "";
    var n = companies.length;
    var loop = n > 1;
    carousel.dataset.n = loop ? n : 0;
    var all = companies;
    if (loop) { all = []; for (var k = 0; k < COPIES; k++) all = all.concat(companies); }
    all.forEach(function (c, i) {
      var card = el("article", "card");
      var inner = el("div", "card-inner");
      var head = el("div", "card-head");
      var names = el("div", "card-names");
      names.appendChild(el("strong", null, c.name));
      names.appendChild(el("span", null, c.en));
      head.appendChild(names);
      if (c.logo) {
        var logo = img("images/" + c.logo, "card-logo");
        logo.alt = c.name + T[lang].logo;
        head.appendChild(logo);
      } else {
        head.appendChild(el("div", "card-logo placeholder", "LOGO"));
      }
      inner.appendChild(head);
      var dKo = el("p", "card-desc", c.ko), dEn = el("p", "card-desc", c.en_desc);
      dKo.lang = "ko"; dEn.lang = "en";
      inner.appendChild(dKo);
      inner.appendChild(dEn);
      card.appendChild(inner);
      if (loop && (i < MID * n || i >= (MID + 1) * n)) card.setAttribute("aria-hidden", "true");
      carousel.appendChild(card);
    });
    carousel.scrollLeft = 0;
    if (loop) carousel.scrollLeft = centerOffset(carousel, carousel.children[MID * n]);
    updateActive(carousel);
  }

  function centerOffset(carousel, card) {
    return card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
  }

  /* 스와이프가 멈췄을 때 가장자리 벌에 있으면 가운데 벌의 같은 카드로 순간 이동 */
  function recenter(carousel) {
    var n = +carousel.dataset.n;
    if (!n) return;
    var cards = carousel.children;
    updateActive(carousel);
    var idx = Array.prototype.indexOf.call(cards, carousel.querySelector(".card.active"));
    if (idx < 0) return;
    var target = MID * n + (idx % n);
    if (target !== idx) carousel.scrollLeft += cards[target].offsetLeft - cards[idx].offsetLeft;
  }

  function updateActive(carousel) {
    var cards = carousel.querySelectorAll(".card");
    if (!cards.length) return;
    var center = carousel.scrollLeft + carousel.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    cards.forEach(function (card, i) {
      var d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    cards.forEach(function (card, i) { card.classList.toggle("active", i === best); });
  }

  var carousel = page.querySelector(".carousel");
  if (carousel) {
    var raf, settle, touching = false, drag = null, dragEndTimer;

    function safeRecenter() {
      if (touching || drag || carousel.classList.contains("dragging")) return;
      recenter(carousel);
    }
    carousel.addEventListener("scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { updateActive(carousel); });
      clearTimeout(settle);
      settle = setTimeout(safeRecenter, 180);
    }, { passive: true });
    /* 최신 브라우저는 스크롤이 완전히 멈춘 시점을 알려줌 */
    carousel.addEventListener("scrollend", function () {
      clearTimeout(settle);
      if (carousel.classList.contains("dragging") && !drag) finishDrag();
      safeRecenter();
    });

    /* 휴대폰: 손가락이 닿아 있는 동안에는 위치를 건드리지 않음 */
    carousel.addEventListener("touchstart", function () { touching = true; }, { passive: true });
    function touchOff() {
      touching = false;
      clearTimeout(settle);
      settle = setTimeout(safeRecenter, 400);
    }
    carousel.addEventListener("touchend", touchOff, { passive: true });
    carousel.addEventListener("touchcancel", touchOff, { passive: true });

    /* PC: 마우스로 끌어서 넘기기 */
    carousel.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      updateActive(carousel);
      drag = { x: e.clientX, left: carousel.scrollLeft, start: carousel.querySelector(".card.active") };
      carousel.classList.add("dragging");
      try { carousel.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    carousel.addEventListener("pointermove", function (e) {
      if (!drag) return;
      carousel.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    function endDrag(e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      var cur = drag.start, target = cur;
      var threshold = carousel.clientWidth * 0.08;
      if (dx < -threshold && cur.nextElementSibling) target = cur.nextElementSibling;
      else if (dx > threshold && cur.previousElementSibling) target = cur.previousElementSibling;
      drag = null;
      carousel.scrollTo({ left: centerOffset(carousel, target), behavior: "smooth" });
      clearTimeout(dragEndTimer);
      dragEndTimer = setTimeout(finishDrag, 700); /* scrollend 미지원 브라우저용 */
    }
    function finishDrag() {
      clearTimeout(dragEndTimer);
      carousel.classList.remove("dragging");
      updateActive(carousel);
      safeRecenter();
    }
    carousel.addEventListener("pointerup", endDrag);
    carousel.addEventListener("pointercancel", endDrag);
    carousel.addEventListener("dragstart", function (e) { e.preventDefault(); });
    window.addEventListener("resize", function () { updateActive(carousel); });

    var zoneKey = document.body.dataset.zone;
    if (zoneKey && window.ZONES[zoneKey]) {
      buildCarousel(carousel, window.ZONES[zoneKey].companies);
    }
  }

  /* ---------- 파트너 페이지: 폴더 → 기업 팝업 ---------- */
  var folders = page.querySelector(".folders");
  var folderTexts = [];
  if (folders) {
    var order = ["ai-service", "ai-innovation", "digital-infra", "best-service"];
    order.forEach(function (key) {
      var z = window.ZONES[key];
      var f = el("button", "folder");
      f.type = "button";
      f.dataset.zone = key;
      if (!z.enabled) f.setAttribute("aria-disabled", "true");
      f.appendChild(el("span", "paper p1"));
      f.appendChild(el("span", "paper p2"));
      f.appendChild(el("span", "paper p3"));
      f.appendChild(img("images/folder_front.svg", "front"));
      var ft = el("span", "f-title");
      f.appendChild(ft);
      var ul = el("ul", "f-list");
      var items = z.companies.slice(0, 3).map(function (c) {
        var li = el("li"); ul.appendChild(li); return { li: li, c: c };
      });
      f.appendChild(ul);
      folders.appendChild(f);
      folderTexts.push({ title: ft, z: z, items: items });

      f.addEventListener("click", function () {
        if (!z.enabled) return;
        f.classList.add("opening");
        setTimeout(function () {
          f.classList.remove("opening");
          openPopup(key, true);
        }, 220);
      });
    });

    var riseTimer;
    function openPopup(key, push) {
      buildCarousel(carousel, window.ZONES[key].companies);
      /* 가운데 카드 기준으로 왼쪽/오른쪽 카드 표시 → 양옆으로 펼쳐지는 방향 */
      var seenActive = false;
      Array.prototype.forEach.call(carousel.children, function (c) {
        if (c.classList.contains("active")) { seenActive = true; return; }
        c.classList.add(seenActive ? "after" : "before");
      });
      page.classList.remove("rising");
      void page.offsetWidth; /* 애니메이션 처음부터 다시 */
      page.classList.add("rising");
      clearTimeout(riseTimer);
      riseTimer = setTimeout(function () { page.classList.remove("rising"); }, 1560);
      page.classList.add("popup");
      if (push) history.pushState({ zone: key }, "", "#" + key);
    }
    function closePopup() {
      page.classList.remove("popup");
    }
    page.querySelector(".back-to-list").addEventListener("click", function () {
      if (history.state && history.state.zone && !history.state.direct) history.back();
      else { closePopup(); history.replaceState(null, "", location.pathname + location.search); }
    });
    window.addEventListener("popstate", function (e) {
      if (e.state && e.state.zone) openPopup(e.state.zone, false);
      else closePopup();
    });
    /* 주소에 #ai-service 처럼 붙어 있으면 바로 열기 */
    var hashKey = location.hash.slice(1);
    if (window.ZONES[hashKey] && window.ZONES[hashKey].enabled) {
      history.replaceState({ zone: hashKey, direct: true }, "", location.href);
      openPopup(hashKey, false);
    }
  }

  /* ---------- 언어 바꾸기 ---------- */
  /* 글자가 칸보다 길면(주로 영어) 한 줄 안에서 조금 줄이고,
     그래도 넘치면 두 줄로 나눠서 맞춤. 크기는 피그마 px 단위. */
  function fitText(node, maxU, size, min, wrap) {
    var s = node.style;
    s.fontSize = s.whiteSpace = s.maxWidth = s.lineHeight = s.textWrap = "";
    if (lang === "ko") return;           /* 한국어는 피그마 그대로 */
    var u = page.getBoundingClientRect().width / 1080, max = maxU * u + 0.5, k;
    s.whiteSpace = "nowrap";
    for (k = size; k >= min; k -= 1) {
      s.fontSize = "calc(" + k + " * var(--u))";
      if (node.offsetWidth <= max) return;
    }
    if (!wrap) return;
    s.whiteSpace = "normal"; s.textWrap = "balance"; s.lineHeight = "1.12";
    s.maxWidth = "calc(" + maxU + " * var(--u))";
    for (k = wrap[0]; k >= wrap[1]; k -= 1) {
      s.fontSize = "calc(" + k + " * var(--u))";
      if (node.offsetHeight <= k * u * 1.12 * 2 + 1) return;
    }
  }
  function fitAll() {
    fitText(brandText, 560, 50, 30);
    fitText(titleText, page.classList.contains("partner") ? 690 : 460, 50, 44, [42, 30]);
    folderTexts.forEach(function (f) { fitText(f.title, 345, 36.938, 30, [32, 24]); });
  }

  function setLang(l, init) {
    lang = l;
    var t = T[l], en = l === "en";
    document.documentElement.lang = l;
    langBox.classList.toggle("en", en);
    langBox.setAttribute("aria-label", t.lang);
    bKo.setAttribute("aria-pressed", String(!en));
    bEn.setAttribute("aria-pressed", String(en));
    brandText.textContent = t.brand;
    menuLinks.forEach(function (m) {
      m.a.textContent = en ? m.p.en : m.p.label;
      m.a.href = m.p.href + (en ? "?lang=en" : "");
    });
    toggle.setAttribute("aria-label", menu.classList.contains("open") ? t.closeMenu : t.openMenu);
    var heading = en ? (pageInfo.en || titleKo) : titleKo;
    titleText.textContent = heading;
    document.title = heading + " | " + t.brand;
    if (hero) {
      var heroImg = hero.querySelector("img");
      heroImg.alt = heading + t.video;
      var playBtn = hero.querySelector(".play");
      if (playBtn) playBtn.setAttribute("aria-label", t.play);
    }
    if (carousel) carousel.setAttribute("aria-label", t.companies);
    var back = page.querySelector(".back-to-list");
    if (back) back.lastChild.nodeValue = t.back;
    folderTexts.forEach(function (f) {
      f.title.textContent = en ? (f.z.title_en || f.z.title) : f.z.title;
      f.items.forEach(function (it) { it.li.textContent = en ? (it.c.en || it.c.name) : it.c.name; });
    });
    fitAll();
    if (!init) {
      try { localStorage.setItem("nia-lang", l); } catch (err) {}
      /* 주소의 ?lang= 도 같이 바꿔서 새로고침해도 유지 */
      var url = location.pathname + (en ? "?lang=en" : "") + location.hash;
      try { history.replaceState(history.state, "", url); } catch (err) {}
    }
  }
  setLang(lang, true);
  /* 글꼴이 늦게 도착하면 글자 폭이 바뀌므로 한 번 더 맞춤 */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  window.addEventListener("resize", fitAll);
})();
