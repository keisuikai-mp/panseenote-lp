const TRIAL_URL = "https://keisuikai-mp.github.io/panseenote/?openExternalBrowser=1";
const HERO_DEMO_URL = "https://keisuikai-mp.github.io/panseenote/?demo=1&openExternalBrowser=1";
const LS_NORMAL_BASIC_CHECKOUT_URL = "https://panseenote.lemonsqueezy.com/checkout/buy/a0fe7a7d-a1e2-435c-864f-f85d38f95ebb?enabled=1440487%2C1440496%2C1440498";
const LS_NORMAL_STANDARD_CHECKOUT_URL = "https://panseenote.lemonsqueezy.com/checkout/buy/fa4935c5-1d3d-4a0b-9285-0d147777a18f?enabled=1440487%2C1440496%2C1440498";
const LS_NORMAL_PREMIUM_CHECKOUT_URL = "https://panseenote.lemonsqueezy.com/checkout/buy/f6372e89-3e57-429e-b57a-eb1fe9804d0b?enabled=1440487%2C1440496%2C1440498";
const LS_BASIC_UPGRADE_STANDARD_CHECKOUT_URL = "https://panseenote.lemonsqueezy.com/checkout/buy/8b135ea9-6a77-4552-97e4-2361a55007e4?enabled=1440501%2C1691433";
const LS_BASIC_UPGRADE_PREMIUM_CHECKOUT_URL = "https://panseenote.lemonsqueezy.com/checkout/buy/93753951-0b84-4ff9-8f7e-9061dc472cfb?enabled=1440501%2C1691433";
const LS_STANDARD_UPGRADE_PREMIUM_CHECKOUT_URL = "https://panseenote.lemonsqueezy.com/checkout/buy/69fa8894-4b2c-4d0e-9480-da06b81c7341?enabled=1691436";

/* Hero slider: image list is editable here */
const HERO_SLIDE_IMAGES = [
  {
    src: "assets/スマホヒーロ（ママ）.png",
    alt: "パンセノートの検索画面例 ママ",
  },
  {
    src: "assets/スマホヒーロ（イオン）.png",
    alt: "パンセノートの検索画面例 イオン",
  },
  {
    src: "assets/スマホヒーロ（あんかけ）.png",
    alt: "パンセノートの検索画面例 あんかけ",
  },
  {
    src: "assets/スマホヒーロ（パナ）.png",
    alt: "パンセノートの検索画面例 パナ",
  },
];
const HERO_SLIDE_INTERVAL_MS = 5000;
const HERO_SLIDE_FADE_MS = 600;
const HERO_SLIDE_INITIAL_INDEX = 0;
const HERO_SLIDE_AUTOPLAY = true;

const BASE_FEATURES = {
  trial: [
    "音声検索・音声登録",
    "写真登録",
    "AIで調べる機能",
    "体験機モード切り替え",
  ],
  paid200: [
    "試用版の全機能",
    "登録 200件まで",
    "ライセンスキー発行",
    "購入後メールでお届け",
  ],
  paid10000: [
    "試用版の全機能",
    "登録10,000件まで",
    "ライセンスキー発行",
    "購入後メールでお届け",
  ],
  paid30000: [
    "試用版の全機能",
    "登録30,000件まで",
    "ライセンスキー発行",
    "購入後メールでお届け",
  ],
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getModeFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const from = params.get("from");

  if (mode === "upgrade" && from === "trial") {
    return "upgrade-trial";
  }
  if (mode === "upgrade" && from === "basic") {
    return "upgrade-basic";
  }
  if (mode === "upgrade" && from === "standard") {
    return "upgrade-standard";
  }
  return "normal";
}

function getUpgradeLicenseKeyFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get("licenseKey") || "").trim().toUpperCase();
}

function buildPlanCheckoutUrl(href) {
  const baseHref = String(href || "").trim();
  const mode = getModeFromLocation();
  const licenseKey = getUpgradeLicenseKeyFromLocation();
  if (!baseHref || !licenseKey) return baseHref;
  if (mode !== "upgrade-basic" && mode !== "upgrade-standard") return baseHref;
  if (baseHref.indexOf("lemonsqueezy.com/checkout/buy/") < 0) return baseHref;
  try {
    const url = new URL(baseHref);
    url.searchParams.set("checkout[custom][licenseKey]", licenseKey);
    return url.toString();
  } catch (_) {
    return baseHref;
  }
}

function buildHeroSlidesHtml() {
  return HERO_SLIDE_IMAGES.map(function (image, index) {
    const classes = ["hero-phone-slide"];
    if (index === HERO_SLIDE_INITIAL_INDEX) {
      classes.push("is-active");
    }
    return (
      '<img class="' +
      classes.join(" ") +
      '" src="' +
      escapeHtml(image.src) +
      '" alt="' +
      escapeHtml(image.alt) +
      '" loading="' +
      (index === HERO_SLIDE_INITIAL_INDEX ? "eager" : "lazy") +
      '">'
    );
  }).join("");
}

function initHeroSlider() {
  const sliderRoot = document.querySelector("[data-hero-slider]");
  const slidesRoot = document.getElementById("hero-phone-slides");
  const heroPrimaryButton = document.querySelector(".hero-primary-button");
  const heroDemoButton = document.querySelector(".hero-demo-button");
  if (!sliderRoot || !slidesRoot) return;

  sliderRoot.style.setProperty("--hero-slider-fade-ms", HERO_SLIDE_FADE_MS + "ms");
  slidesRoot.innerHTML = buildHeroSlidesHtml();

  if (heroPrimaryButton) {
    heroPrimaryButton.setAttribute("href", TRIAL_URL);
  }
  if (heroDemoButton) {
    heroDemoButton.setAttribute("href", HERO_DEMO_URL);
  }

  const slides = Array.from(slidesRoot.querySelectorAll(".hero-phone-slide"));
  if (!HERO_SLIDE_AUTOPLAY || slides.length <= 1) return;

  let currentIndex = Math.min(
    Math.max(HERO_SLIDE_INITIAL_INDEX, 0),
    slides.length - 1
  );

  window.setInterval(function () {
    slides[currentIndex].classList.remove("is-active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("is-active");
  }, HERO_SLIDE_INTERVAL_MS);
}

function measureChWidth(referenceEl, units) {
  const probe = document.createElement("span");
  const computedStyle = window.getComputedStyle(referenceEl);
  probe.textContent = "";
  probe.style.display = "inline-block";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.whiteSpace = "pre";
  probe.style.font = computedStyle.font;
  probe.style.letterSpacing = computedStyle.letterSpacing;
  probe.style.width = units + "ch";
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

function getTextRightEdge(referenceEl) {
  const range = document.createRange();
  range.selectNodeContents(referenceEl);

  const rects = range.getClientRects();
  if (rects.length > 0) {
    return rects[rects.length - 1].right;
  }

  return referenceEl.getBoundingClientRect().right;
}

function initHeroPhonePosition() {
  const desktopMedia = window.matchMedia("(min-width: 881px)");
  const heroVisualColumn = document.querySelector(".hero-visual-column");
  const heroPhoneArea = document.querySelector(".hero-phone-area");
  const heroPhoneSlider = document.querySelector(".hero-phone-slider");
  const valueAnchor = document.querySelector(".hero-value-copy-line:nth-child(2)");

  if (!heroVisualColumn || !heroPhoneArea || !heroPhoneSlider || !valueAnchor) return;

  function updatePhonePosition() {
    if (!desktopMedia.matches) {
      heroVisualColumn.style.removeProperty("--hero-phone-left");
      return;
    }

    const anchorRight = getTextRightEdge(valueAnchor);
    const visualRect = heroVisualColumn.getBoundingClientRect();
    const phoneAreaRect = heroPhoneArea.getBoundingClientRect();
    const phoneSliderRect = heroPhoneSlider.getBoundingClientRect();
    const sliderInnerOffset = phoneSliderRect.left - phoneAreaRect.left;
    const gapPx = measureChWidth(valueAnchor, 0);
    const leftPx = anchorRight - visualRect.left + gapPx - sliderInnerOffset;

    heroVisualColumn.style.setProperty("--hero-phone-left", leftPx + "px");
  }

  updatePhonePosition();
  window.addEventListener("resize", updatePhonePosition);

  if (document.fonts && typeof document.fonts.ready?.then === "function") {
    document.fonts.ready.then(updatePhonePosition);
  }
}

function getPricingState(mode) {
  if (mode === "upgrade-trial") {
    return {
      title: "プラン・料金",
      lead: "ご希望の登録上限件数によってプランを選択してください。有料プランは全て買い切り型で、アカウント登録も不要です。",
      plans: [
        {
          name: "試用版（トライアル）",
          limit: "登録上限 100件",
          price: "¥0",
          unit: "無料",
          note: "アカウント登録不要",
          features: BASE_FEATURES.trial,
          buttonLabel: "今すぐ試す",
          href: TRIAL_URL,
          trial: true,
          disabled: true,
        },
        {
          name: "ベーシック",
          limit: "登録上限 200件",
          price: "¥1,280",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid200,
          buttonLabel: "購入する",
          href: LS_NORMAL_BASIC_CHECKOUT_URL,
        },
        {
          name: "スタンダード",
          limit: "登録上限 10,000件",
          price: "¥2,480",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid10000,
          buttonLabel: "購入する",
          href: LS_NORMAL_STANDARD_CHECKOUT_URL,
          featured: true,
          badge: "おすすめ",
        },
        {
          name: "プレミアム",
          limit: "登録上限 30,000件",
          price: "¥4,980",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid30000,
          buttonLabel: "購入する",
          href: LS_NORMAL_PREMIUM_CHECKOUT_URL,
        },
      ],
    };
  }

  if (mode === "upgrade-basic") {
    return {
      title: "プラン・アップグレード料金",
      lead: "現在、ベーシックプランをご利用中です。ベーシックプランからのアップグレードプランをご紹介します。",
      plans: [
        {
          name: "試用版（トライアル）",
          limit: "登録上限 100件",
          price: "¥0",
          unit: "無料",
          note: "アカウント登録不要",
          features: BASE_FEATURES.trial,
          buttonLabel: "今すぐ試す",
          href: TRIAL_URL,
          disabled: true,
        },
        {
          name: "ベーシック",
          limit: "登録上限 200件",
          price: "¥1,280",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid200,
          buttonLabel: "購入する",
          href: LS_NORMAL_BASIC_CHECKOUT_URL,
          disabled: true,
        },
        {
          name: "スタンダード（アップグレード）",
          limit: "登録上限 10,000件",
          price: "¥1,680",
          oldPrice: "¥2,480",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid10000,
          buttonLabel: "購入する",
          href: LS_BASIC_UPGRADE_STANDARD_CHECKOUT_URL,
          featured: true,
          badge: "おすすめ",
        },
        {
          name: "プレミアム（アップグレード）",
          limit: "登録上限 30,000件",
          price: "¥3,880",
          oldPrice: "¥4,980",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid30000,
          buttonLabel: "購入する",
          href: LS_BASIC_UPGRADE_PREMIUM_CHECKOUT_URL,
        },
      ],
    };
  }

  if (mode === "upgrade-standard") {
    return {
      title: "プラン・アップグレード料金",
      lead: "現在、スタンダードプランをご利用中です。スタンダードプランからのアップグレードプランをご紹介します。",
      plans: [
        {
          name: "試用版（トライアル）",
          limit: "登録上限 100件",
          price: "¥0",
          unit: "無料",
          note: "アカウント登録不要",
          features: BASE_FEATURES.trial,
          buttonLabel: "今すぐ試す",
          href: TRIAL_URL,
          disabled: true,
        },
        {
          name: "ベーシック",
          limit: "登録上限 200件",
          price: "¥1,280",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid200,
          buttonLabel: "購入する",
          href: LS_NORMAL_BASIC_CHECKOUT_URL,
          disabled: true,
        },
        {
          name: "スタンダード",
          limit: "登録上限 10,000件",
          price: "¥2,480",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid10000,
          buttonLabel: "購入する",
          href: LS_NORMAL_STANDARD_CHECKOUT_URL,
          disabled: true,
          featured: true,
          badge: "おすすめ",
        },
        {
          name: "プレミアム（アップグレード）",
          limit: "登録上限 30,000件",
          price: "¥2,680",
          oldPrice: "¥4,980",
          unit: "買い切り",
          note: "税込",
          features: BASE_FEATURES.paid30000,
          buttonLabel: "購入する",
          href: LS_STANDARD_UPGRADE_PREMIUM_CHECKOUT_URL,
        },
      ],
    };
  }

  return {
    title: "プラン・料金",
    lead: "試用版は登録件数100件まで完全無料。有料プランは全て買い切り型で、アカウント登録も不要です。",
    subNote: "・有料プランをご利用中のお客様のプランアップについては、別コースが用意されています。アプリ内のプランアップボタンからお申し込みください。",
    plans: [
      {
        name: "試用版（トライアル）",
        limit: "登録上限 100件",
        price: "¥0",
        unit: "無料",
        note: "アカウント登録不要",
        features: BASE_FEATURES.trial,
        buttonLabel: "無料で試す",
        buttonSubLabel: "（インストール不要）",
        href: TRIAL_URL,
        secondaryHref: HERO_DEMO_URL,
        secondaryButtonLabel: "サンプル入り",
        secondaryButtonSubLabel: "体験版",
        trial: true,
      },
      {
        name: "ベーシック",
        limit: "登録上限 200件",
        price: "¥1,280",
        unit: "買い切り",
        note: "税込",
        features: BASE_FEATURES.paid200,
        buttonLabel: "購入する",
        href: LS_NORMAL_BASIC_CHECKOUT_URL,
      },
      {
        name: "スタンダード",
        limit: "登録上限 10,000件",
        price: "¥2,480",
        unit: "買い切り",
        note: "税込",
        features: BASE_FEATURES.paid10000,
        buttonLabel: "購入する",
        href: LS_NORMAL_STANDARD_CHECKOUT_URL,
        featured: true,
        badge: "おすすめ",
      },
      {
        name: "プレミアム",
        limit: "登録上限 30,000件",
        price: "¥4,980",
        unit: "買い切り",
        note: "税込",
        features: BASE_FEATURES.paid30000,
        buttonLabel: "購入する",
        href: LS_NORMAL_PREMIUM_CHECKOUT_URL,
      },
    ],
  };
}

function buildPlanNameHtml(name) {
  const text = String(name || "").trim();
  const match = text.match(/^(.*?)(（.+）)$/);
  if (!match) {
    return '<span class="plan-name-main">' + text + "</span>";
  }
  return (
    '<span class="plan-name-main">' + match[1] + "</span>" +
    '<span class="plan-name-sub">' + match[2] + "</span>"
  );
}

function buildPlanButtonHtml(buttonClasses, href, label, subLabel, disabled) {
  const resolvedHref = buildPlanCheckoutUrl(href);
  const contentHtml = subLabel
    ? '<span class="plan-btn-text-wrap">' +
      '<span class="plan-btn-text-main">' +
      escapeHtml(label) +
      "</span>" +
      '<span class="plan-btn-text-sub">' +
      escapeHtml(subLabel) +
      "</span></span>"
    : escapeHtml(label);
  const classes = [buttonClasses, subLabel ? "has-sub" : ""]
    .filter(Boolean)
    .join(" ");

  if (disabled) {
    return (
      '<button class="' +
      classes +
      '" type="button" disabled aria-disabled="true">' +
      contentHtml +
      "</button>"
    );
  }

  return (
    '<a class="' +
    classes +
    '" href="' +
    resolvedHref +
    '">' +
    contentHtml +
    "</a>"
  );
}

function renderPlans(plans) {
  return plans
    .map(function (plan) {
      const cardClasses = [
        "plan-card",
        plan.featured ? "is-featured" : "",
        plan.disabled ? "is-disabled" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const badgeHtml = plan.badge
        ? '<div class="plan-badge">' + plan.badge + "</div>"
        : "";

      const oldPriceHtml = plan.oldPrice
        ? '<p class="plan-price-old">' + plan.oldPrice + "</p>"
        : "";

      const featureHtml = plan.features
        .map(function (feature) {
          return "<li>" + feature + "</li>";
        })
        .join("");

      const buttonClasses = ["plan-btn", plan.trial ? "is-trial" : ""]
        .filter(Boolean)
        .join(" ");

      const buttonHtml =
        plan.secondaryHref && !plan.disabled
          ? buildPlanButtonHtml(
              buttonClasses,
              plan.href,
              plan.buttonLabel,
              plan.buttonSubLabel,
              false
            ) +
            buildPlanButtonHtml(
              buttonClasses,
              plan.secondaryHref,
              plan.secondaryButtonLabel,
              plan.secondaryButtonSubLabel,
              false
            )
          : buildPlanButtonHtml(
              buttonClasses,
              plan.href,
              plan.buttonLabel,
              plan.buttonSubLabel,
              !!plan.disabled
            );
      const actionClasses = ["plan-action", plan.secondaryHref && !plan.disabled ? "is-dual" : ""]
        .filter(Boolean)
        .join(" ");

      return (
        '<article class="' +
        cardClasses +
        '">' +
        badgeHtml +
        '<h3 class="plan-name">' +
        buildPlanNameHtml(plan.name) +
        "</h3>" +
        '<p class="plan-limit">' +
        plan.limit +
        "</p>" +
        '<div class="plan-price-wrap">' +
        '<p class="plan-price">' +
        plan.price +
        '<span class="plan-price-unit">' +
        plan.unit +
        "</span></p>" +
        oldPriceHtml +
        '<p class="plan-price-note">' +
        plan.note +
        "</p>" +
        "</div>" +
        '<ul class="plan-features">' +
        featureHtml +
        "</ul>" +
        '<div class="' +
        actionClasses +
        '">' +
        buttonHtml +
        "</div>" +
        "</article>"
      );
    })
    .join("");
}

function initPricing() {
  const titleEl = document.getElementById("pricing-title");
  const leadEl = document.getElementById("pricing-lead");
  const subNoteEl = document.getElementById("pricing-subnote");
  const gridEl = document.getElementById("pricing-grid");
  if (!titleEl || !leadEl || !gridEl) return;

  const state = getPricingState(getModeFromLocation());
  titleEl.textContent = state.title;
  leadEl.textContent = state.lead;
  if (subNoteEl) {
    if (state.subNote) {
      subNoteEl.textContent = state.subNote;
      subNoteEl.removeAttribute("hidden");
    } else {
      subNoteEl.textContent = "";
      subNoteEl.setAttribute("hidden", "");
    }
  }
  gridEl.innerHTML = renderPlans(state.plans);
}

document.addEventListener("DOMContentLoaded", function () {
  initHeroSlider();
  initHeroPhonePosition();
  initPricing();
});
