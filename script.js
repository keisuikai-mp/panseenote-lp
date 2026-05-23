const TRIAL_URL = "https://example.com/panseenote/trial";
const LS_NORMAL_CHECKOUT_URL = "https://example.com/panseenote/checkout/standard";
const LS_BASIC_UPGRADE_CHECKOUT_URL = "https://example.com/panseenote/checkout/upgrade/basic-to-standard";
const LS_STANDARD_UPGRADE_CHECKOUT_URL = "https://example.com/panseenote/checkout/upgrade/standard-to-premium";

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

function buildCheckoutUrl(baseUrl, planCode) {
  const safeBase = String(baseUrl || "#");
  const safePlan = String(planCode || "").trim();
  if (!safePlan || safeBase === "#") return safeBase;
  return safeBase + (safeBase.indexOf("?") >= 0 ? "&" : "?") + "plan=" + encodeURIComponent(safePlan);
}

function getModeFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const from = params.get("from");

  if (mode === "upgrade" && from === "basic") {
    return "upgrade-basic";
  }
  if (mode === "upgrade" && from === "standard") {
    return "upgrade-standard";
  }
  return "normal";
}

function getPricingState(mode) {
  if (mode === "upgrade-basic") {
    return {
      title: "プラン・料金（ベーシックプランからのアップグレード）",
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
          href: LS_NORMAL_CHECKOUT_URL,
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
          href: buildCheckoutUrl(LS_BASIC_UPGRADE_CHECKOUT_URL, "standard"),
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
          href: buildCheckoutUrl(LS_BASIC_UPGRADE_CHECKOUT_URL, "premium"),
        },
      ],
    };
  }

  if (mode === "upgrade-standard") {
    return {
      title: "プラン・料金（スタンダードプランからのアップグレード）",
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
          href: buildCheckoutUrl(LS_NORMAL_CHECKOUT_URL, "basic"),
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
          href: buildCheckoutUrl(LS_NORMAL_CHECKOUT_URL, "standard"),
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
          href: buildCheckoutUrl(LS_STANDARD_UPGRADE_CHECKOUT_URL, "premium"),
        },
      ],
    };
  }

  return {
    title: "プラン・料金",
    lead: "試用版は登録件数100件まで完全無料。有料プランはすべて買い切り型です。",
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
      },
      {
        name: "ベーシック",
        limit: "登録上限 200件",
        price: "¥1,280",
        unit: "買い切り",
        note: "税込",
        features: BASE_FEATURES.paid200,
        buttonLabel: "購入する",
        href: buildCheckoutUrl(LS_NORMAL_CHECKOUT_URL, "basic"),
      },
      {
        name: "スタンダード",
        limit: "登録上限 10,000件",
        price: "¥2,480",
        unit: "買い切り",
        note: "税込",
        features: BASE_FEATURES.paid10000,
        buttonLabel: "購入する",
        href: buildCheckoutUrl(LS_NORMAL_CHECKOUT_URL, "standard"),
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
        href: buildCheckoutUrl(LS_NORMAL_CHECKOUT_URL, "premium"),
      },
    ],
  };
}

function renderPlans(plans) {
  return plans.map(function (plan) {
    const cardClasses = [
      "plan-card",
      plan.featured ? "is-featured" : "",
      plan.disabled ? "is-disabled" : "",
    ].filter(Boolean).join(" ");

    const badgeHtml = plan.badge
      ? '<div class="plan-badge">' + plan.badge + "</div>"
      : '<div class="plan-badge" hidden></div>';

    const oldPriceHtml = plan.oldPrice
      ? '<p class="plan-price-old">' + plan.oldPrice + "</p>"
      : "";

    const featureHtml = plan.features.map(function (feature) {
      return "<li>" + feature + "</li>";
    }).join("");

    const buttonClasses = [
      "plan-btn",
      plan.trial ? "is-trial" : "",
    ].filter(Boolean).join(" ");

    const buttonAttrs = plan.disabled
      ? ' aria-disabled="true" tabindex="-1"'
      : "";

    return (
      '<article class="' + cardClasses + '">' +
        badgeHtml +
        '<h2 class="plan-name">' + plan.name + "</h2>" +
        '<p class="plan-limit">' + plan.limit + "</p>" +
        '<div class="plan-price-wrap">' +
          '<p class="plan-price">' + plan.price + '<span class="plan-price-unit">' + plan.unit + "</span></p>" +
          oldPriceHtml +
          '<p class="plan-price-note">' + plan.note + "</p>" +
        "</div>" +
        '<ul class="plan-features">' + featureHtml + "</ul>" +
        '<div class="plan-action">' +
          '<a class="' + buttonClasses + '" href="' + plan.href + '"' + buttonAttrs + ">" + plan.buttonLabel + "</a>" +
        "</div>" +
      "</article>"
    );
  }).join("");
}

function initPricing() {
  const titleEl = document.getElementById("pricing-title");
  const leadEl = document.getElementById("pricing-lead");
  const gridEl = document.getElementById("pricing-grid");
  if (!titleEl || !leadEl || !gridEl) return;

  const state = getPricingState(getModeFromLocation());
  titleEl.textContent = state.title;
  leadEl.textContent = state.lead;
  gridEl.innerHTML = renderPlans(state.plans);
}

document.addEventListener("DOMContentLoaded", initPricing);
