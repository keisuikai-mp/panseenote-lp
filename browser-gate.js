(function (global) {
  "use strict";

  var GUIDE_PAGE_PATH = "external-browser.html";
  var FACEBOOK_APP_PATTERN = /FBAN|FBAV|FB_IAB|FBIOS|FB4A/i;
  var X_APP_PATTERN = /Twitter|TwitterAndroid/i;
  var NON_SAFARI_IOS_PATTERN = /CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser|DuckDuckGo|GSA|Line\/|FBAN|FBAV|FB_IAB|FBIOS|FB4A|Twitter/i;

  function getNavigator() {
    return global.navigator || {};
  }

  function getLocation() {
    return global.location || null;
  }

  function getDocument() {
    return global.document || null;
  }

  function isAppleMobileDevice() {
    var nav = getNavigator();
    var ua = String(nav.userAgent || "");
    var platform = String(nav.platform || "");
    var maxTouchPoints = Number(nav.maxTouchPoints || 0);

    return /iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  }

  function detectApp() {
    var nav = getNavigator();
    var ua = String(nav.userAgent || "");

    if (!isAppleMobileDevice()) {
      return null;
    }
    if (FACEBOOK_APP_PATTERN.test(ua)) {
      return "facebook";
    }
    if (X_APP_PATTERN.test(ua)) {
      return "x";
    }
    return null;
  }

  function isMobileSafari() {
    var nav = getNavigator();
    var ua = String(nav.userAgent || "");

    if (!isAppleMobileDevice()) {
      return false;
    }
    if (!/Safari/i.test(ua) || !/Version\//i.test(ua)) {
      return false;
    }
    return !NON_SAFARI_IOS_PATTERN.test(ua);
  }

  function resolveReturnUrl(rawValue) {
    var location = getLocation();
    if (!location) {
      return "./index.html";
    }

    var fallbackUrl = new URL("./index.html", location.href);
    var rawText = String(rawValue || "").trim();
    if (!rawText) {
      return fallbackUrl.pathname + fallbackUrl.search + fallbackUrl.hash;
    }

    try {
      var resolved = new URL(rawText, location.href);
      if (resolved.origin !== location.origin) {
        return fallbackUrl.pathname + fallbackUrl.search + fallbackUrl.hash;
      }
      return resolved.pathname + resolved.search + resolved.hash;
    } catch (_) {
      return fallbackUrl.pathname + fallbackUrl.search + fallbackUrl.hash;
    }
  }

  function buildGuideUrl(appName) {
    var location = getLocation();
    if (!location) {
      return GUIDE_PAGE_PATH;
    }

    var guideUrl = new URL(GUIDE_PAGE_PATH, location.href);
    var currentPath = location.pathname || "";
    var currentSearch = location.search || "";
    var currentHash = location.hash || "";

    guideUrl.searchParams.set("from", appName);
    guideUrl.searchParams.set("returnTo", currentPath + currentSearch + currentHash);
    return guideUrl.toString();
  }

  function redirectIndexIfNeeded() {
    var location = getLocation();
    var appName;

    if (!location) {
      return false;
    }
    if (location.pathname && /\/external-browser\.html$/i.test(location.pathname)) {
      return false;
    }

    appName = detectApp();
    if (!appName) {
      return false;
    }

    location.replace(buildGuideUrl(appName));
    return true;
  }

  function getGuideContext() {
    var location = getLocation();
    var appName = detectApp();
    var returnTo = "./index.html";

    if (!location) {
      return {
        appName: appName,
        returnTo: returnTo,
        isMobileSafari: isMobileSafari(),
      };
    }

    try {
      var params = new URLSearchParams(location.search || "");
      var fromParam = String(params.get("from") || "").trim().toLowerCase();
      if (fromParam === "facebook" || fromParam === "x") {
        appName = fromParam;
      }
      returnTo = resolveReturnUrl(params.get("returnTo"));
    } catch (_) {
      returnTo = "./index.html";
    }

    return {
      appName: appName,
      returnTo: returnTo,
      isMobileSafari: isMobileSafari(),
    };
  }

  function renderExternalBrowserPage(context) {
    var document = getDocument();
    var titleEl;
    var facebookEl;
    var xEl;
    var fallbackEl;

    if (!document) {
      return;
    }

    titleEl = document.querySelector("[data-guide-title]");
    facebookEl = document.querySelector("[data-guide-facebook]");
    xEl = document.querySelector("[data-guide-x]");
    fallbackEl = document.querySelector("[data-guide-fallback]");

    if (titleEl) {
      titleEl.hidden = false;
    }
    if (facebookEl) {
      facebookEl.hidden = context.appName !== "facebook";
    }
    if (xEl) {
      xEl.hidden = context.appName !== "x";
    }
    if (fallbackEl) {
      fallbackEl.hidden = context.appName === "facebook" || context.appName === "x";
    }
  }

  function initExternalBrowserPage() {
    var document = getDocument();
    var context = getGuideContext();

    if (!document) {
      return;
    }
    if (context.isMobileSafari) {
      global.location.replace(context.returnTo);
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        renderExternalBrowserPage(context);
      });
      return;
    }

    renderExternalBrowserPage(context);
  }

  global.panseenoteLpBrowserGate = {
    detectApp: detectApp,
    initExternalBrowserPage: initExternalBrowserPage,
    isAppleMobileDevice: isAppleMobileDevice,
    isMobileSafari: isMobileSafari,
    redirectIndexIfNeeded: redirectIndexIfNeeded,
    resolveReturnUrl: resolveReturnUrl,
  };
})(window);
