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

  /* ---------- 상단 바 + 메뉴 ---------- */
  var menu = el("div", "menu");
  var toggle = el("button", "menu-toggle");
  toggle.setAttribute("aria-label", "메뉴 열기");
  toggle.setAttribute("aria-expanded", "false");
  toggle.appendChild(img("images/icon_close.svg"));

  var brand = el("div", "brand");
  brand.appendChild(img("images/icon_flag.svg"));
  brand.appendChild(el("span", null, "AI · 디지털정부 전시관"));

  var list = el("ul", "menu-list");
  window.PAGES.forEach(function (p) {
    var li = el("li"), a = el("a", null, p.label);
    a.href = p.href;
    if (p.href === current) a.setAttribute("aria-current", "page");
    a.tabIndex = -1;
    li.appendChild(a); list.appendChild(li);
  });

  menu.appendChild(toggle); menu.appendChild(brand); menu.appendChild(list);
  page.insertBefore(menu, page.firstChild);

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
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
        logo.alt = c.name + " 로고";
        head.appendChild(logo);
      } else {
        head.appendChild(el("div", "card-logo placeholder", "LOGO"));
      }
      inner.appendChild(head);
      inner.appendChild(el("p", "card-desc", c.ko));
      inner.appendChild(el("p", "card-desc", c.en_desc));
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
  if (folders) {
    var order = ["ai-service", "ai-innovation", "digital-infra", "best-service"];
    order.forEach(function (key) {
      var z = window.ZONES[key];
      var f = el("button", "folder");
      f.type = "button";
      f.dataset.zone = key;
      if (!z.enabled) f.setAttribute("aria-disabled", "true");
      f.appendChild(el("span", "back"));
      f.appendChild(el("span", "paper p1"));
      f.appendChild(el("span", "paper p2"));
      f.appendChild(el("span", "paper p3"));
      f.appendChild(img("images/folder_front.svg", "front"));
      f.appendChild(el("span", "f-title", z.title));
      var ul = el("ul", "f-list");
      z.companies.slice(0, 3).forEach(function (c) { ul.appendChild(el("li", null, c.name)); });
      f.appendChild(ul);
      folders.appendChild(f);

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
      else { closePopup(); history.replaceState(null, "", location.pathname); }
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
})();
