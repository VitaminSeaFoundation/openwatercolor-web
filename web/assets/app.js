/*
 * The H5 user interface, shared by every web-based target (hosted website, Xiaohongshu mini tool).
 * Depends on, loaded before this file as classic scripts:
 *   window.UnderwaterCore     core/restore.js   colour model
 *   window.UnderwaterCompare  core/compare.js   shareable before/after image
 *   window.UnderwaterI18n     core/i18n.js      strings
 *   window.UnderwaterPlatform platform.js       save / share / comment for this target (web/platforms/*.js)
 */
(function () {
  "use strict";

  var Core = window.UnderwaterCore;
  var Compare = window.UnderwaterCompare;
  var I18n = window.UnderwaterI18n;
  var platform = window.UnderwaterPlatform;

  var SWEEP_MS = 1500;  // one pass of compare-scan in style.css: a chosen photo always gets a full pass
  var FISH_PATH = "M30 10C25 4 15 2 8 8L2 3V17L8 12C15 18 25 16 30 10Z";

  var root = document.documentElement;
  var compareFrame = document.getElementById("compare-frame");
  var compareCanvas = document.getElementById("compare-canvas");
  var compareDivider = document.getElementById("compare-divider");
  var photoInput = document.getElementById("photo-input");
  var importButton = document.getElementById("import-button");
  var importLabel = document.getElementById("import-label");
  var saveButton = document.getElementById("save-button");
  var saveLabel = document.getElementById("save-label");
  var shareButton = document.getElementById("share-button");
  var shareLabel = document.getElementById("share-label");
  var commentButton = document.getElementById("comment-button");
  var commentLabel = document.getElementById("comment-label");
  var anotherButton = document.getElementById("another-button");
  var languageShort = document.getElementById("language-short");
  var languageSelect = document.getElementById("language-select");
  var resultActions = document.getElementById("result-actions");
  var strengthControl = document.getElementById("strength-control");
  var strengthInput = document.getElementById("strength-input");
  var strengthValue = document.getElementById("strength-value");
  var tuningSliders = ["warmth", "water", "clarity"].map(function (name) {
    return { input: document.getElementById(name + "-input"), value: document.getElementById(name + "-value") };
  });
  var photoStatus = document.getElementById("photo-status");
  var photoCaption = document.getElementById("photo-caption");
  var previewHint = document.getElementById("preview-hint");
  var privacyNote = document.getElementById("privacy-note");
  var savedOverlay = document.getElementById("saved-overlay");
  var savedContent = document.getElementById("saved-content");
  var savedInner = document.getElementById("saved-inner");
  var savedTitle = document.getElementById("saved-title");
  var savedAsk = document.getElementById("saved-ask");
  var savedClose = document.getElementById("saved-close-button");
  var savedLife = document.getElementById("saved-life");
  var savedPhoto = document.getElementById("saved-photo");
  var savedBefore = document.getElementById("saved-before");
  var savedAfter = document.getElementById("saved-after");
  var savedShareButton = document.getElementById("saved-share-button");
  var savedShareLabel = document.getElementById("saved-share-label");
  var savedCommentButton = document.getElementById("saved-comment-button");
  var savedDismissButton = document.getElementById("saved-dismiss-button");

  var compareContext = compareCanvas && compareCanvas.getContext("2d");
  var sourceCanvas = document.createElement("canvas");
  var restoredCanvas = document.createElement("canvas");
  var resultCanvas = document.createElement("canvas");
  var sourceContext = sourceCanvas.getContext("2d");
  var restoredContext = restoredCanvas.getContext("2d");
  var resultContext = resultCanvas.getContext("2d");
  var sampleImage = new Image();
  var isBusy = false;
  var comparisonValue = 50;
  var canAdjustStrength = false;
  var reprocessPending = false;
  var isDraggingDivider = false;
  var activePointerId = null;
  var savedHideTimer = null;

  /* Texts that depend on state are kept as keys, so switching language re-renders them. */
  var view = {
    caption: "captionSample",
    hint: "hintDrag",
    privacy: "privacyStart",
    saveLabel: "save",
    shareLabel: null,
    commentLabel: null,
    status: { key: "", params: null, isError: false }
  };

  var i18n = I18n.create(I18n.resolve(platform.languageCandidates()));
  function t(key, params) { return i18n.t(key, params); }
  t.format = I18n.format || function (text) { return text; };

  /* ---------- Language ---------- */

  function applyLanguage() {
    root.lang = i18n.language;
    root.setAttribute("data-platform", platform.id);
    document.title = t("appName");
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (element) {
      element.textContent = t(element.getAttribute("data-i18n"));
    });
    // data-i18n-attr="aria-label:key; title:key"
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-attr]"), function (element) {
      element.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) element.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
    if (languageSelect) {
      var current = I18n.LANGUAGES.filter(function (language) { return language.code === i18n.language; })[0];
      if (languageShort && current) languageShort.textContent = current.short;
      languageSelect.value = i18n.language;
    }
    renderTexts();
  }

  function renderTexts() {
    photoCaption.textContent = t(view.caption);
    previewHint.textContent = t(view.hint);
    privacyNote.textContent = t(view.privacy);
    importLabel.textContent = t(isBusy ? "busy" : "importIdle");
    saveLabel.textContent = t(isBusy ? "busy" : view.saveLabel);
    shareLabel.textContent = t(view.shareLabel || platform.labels.share || "share");
    savedShareLabel.textContent = t(platform.labels.share || "share");
    if (commentLabel) commentLabel.textContent = t(view.commentLabel || platform.labels.comment || "xhsComment");
    savedTitle.textContent = t(platform.labels.saved);
    renderStatus();
  }

  function buildLanguageMenu() {
    if (!languageSelect) return;
    I18n.LANGUAGES.forEach(function (language) {
      var option = document.createElement("option");
      option.value = language.code;
      option.lang = language.code;
      option.textContent = language.label;
      languageSelect.appendChild(option);
    });
  }

  function switchLanguage() {
    var code = languageSelect.value;
    if (!code || code === i18n.language) return;
    i18n = I18n.create(code);
    platform.rememberLanguage(i18n.language);
    applyLanguage();
  }

  /* ---------- Status line ---------- */

  function setStatus(key, params, isError) {
    view.status = { key: key || "", params: params || null, isError: !!isError };
    renderStatus();
  }

  function renderStatus() {
    photoStatus.textContent = view.status.key ? t(view.status.key, view.status.params) : "";
    photoStatus.className = view.status.isError ? "photo-status is-error" : "photo-status";
  }

  /* Errors carrying { i18nKey, params } come from this file and the platform adapters; anything else is unexpected. */
  function setErrorStatus(error, fallbackKey) {
    if (error && error.i18nKey) setStatus(error.i18nKey, error.params, true);
    else setStatus(fallbackKey, null, true);
  }

  function fail(key) {
    return { i18nKey: key };
  }

  /* ---------- Comparison view ---------- */

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function renderComparison() {
    if (!compareContext || !sourceCanvas.width || !resultCanvas.width) return;
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
    var fraction = comparisonValue / 100;
    if (compareCanvas.width !== width || compareCanvas.height !== height) {
      compareCanvas.width = width;
      compareCanvas.height = height;
    }
    compareContext.clearRect(0, 0, width, height);
    compareContext.drawImage(resultCanvas, 0, 0);
    compareContext.save();
    compareContext.beginPath();
    compareContext.rect(0, 0, width * fraction, height);
    compareContext.clip();
    compareContext.drawImage(sourceCanvas, 0, 0);
    compareContext.restore();
    compareDivider.style.left = (fraction * 100) + "%";
    compareDivider.setAttribute("aria-valuenow", String(Math.round(comparisonValue)));
  }

  /* resultCanvas is what the preview, save and share all use, so they all follow the slider. */
  function applyStrength() {
    if (!sourceCanvas.width) return;
    resultContext.globalAlpha = 1;
    resultContext.drawImage(sourceCanvas, 0, 0);
    resultContext.globalAlpha = strengthInput.value / 100;
    resultContext.drawImage(restoredCanvas, 0, 0);
    resultContext.globalAlpha = 1;
    renderComparison();
  }

  function updateStrengthDisplay() {
    strengthValue.textContent = strengthInput.value + "%";
    strengthInput.style.setProperty("--fill-to", strengthInput.value + "%");
  }

  function updateTuningDisplay(slider) {
    var value = Number(slider.input.value);
    var position = value + 50;
    slider.value.textContent = value > 0 ? "+" + value : String(value);
    slider.input.style.setProperty("--fill-from", Math.min(50, position) + "%");
    slider.input.style.setProperty("--fill-to", Math.max(50, position) + "%");
  }

  function setComparisonFromPointer(clientX) {
    var frame = compareCanvas.getBoundingClientRect();
    if (!frame || !frame.width) return;
    comparisonValue = clamp((clientX - frame.left) / frame.width * 100, 0, 100);
    renderComparison();
  }

  function startDividerDrag(event) {
    if (event.isPrimary === false || (typeof event.button === "number" && event.button !== 0)) return;
    isDraggingDivider = true;
    activePointerId = typeof event.pointerId === "number" ? event.pointerId : null;
    event.preventDefault();
    setComparisonFromPointer(event.clientX);
    if (typeof compareDivider.setPointerCapture === "function" && activePointerId !== null) {
      try { compareDivider.setPointerCapture(activePointerId); } catch (error) {}
    }
  }

  function moveDividerDrag(event) {
    if (!isDraggingDivider) return;
    if (activePointerId !== null && event.pointerId !== activePointerId) return;
    event.preventDefault();
    setComparisonFromPointer(event.clientX);
  }

  function stopDividerDrag(event) {
    if (!isDraggingDivider) return;
    if (activePointerId !== null && event.pointerId !== activePointerId) return;
    isDraggingDivider = false;
    activePointerId = null;
  }

  function moveDividerByKeyboard(event) {
    var nextValue = comparisonValue;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextValue -= 2;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") nextValue += 2;
    else if (event.key === "Home") nextValue = 0;
    else if (event.key === "End") nextValue = 100;
    else return;
    event.preventDefault();
    comparisonValue = clamp(nextValue, 0, 100);
    renderComparison();
  }

  /* ---------- Busy state ---------- */

  function setBusy(busy) {
    isBusy = busy;
    importButton.disabled = busy;
    importLabel.textContent = t(busy ? "busy" : "importIdle");
    view.saveLabel = platform.labels.save;
    saveLabel.textContent = t(busy ? "busy" : platform.labels.save);
    setButtonsDisabled(busy);
  }

  function setButtonsDisabled(disabled) {
    saveButton.disabled = disabled;
    shareButton.disabled = disabled;
    if (commentButton) commentButton.disabled = disabled;
    anotherButton.disabled = disabled;
  }

  function setSlidersDisabled(disabled) {
    strengthInput.disabled = disabled || !canAdjustStrength;
    tuningSliders.forEach(function (slider) {
      slider.input.disabled = disabled || !canAdjustStrength;
    });
  }

  function setResultActionsDisabled(disabled) {
    setButtonsDisabled(disabled);
    setSlidersDisabled(disabled);
  }

  function wait(milliseconds) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, milliseconds);
    });
  }

  /* The sweep animates only transform, so the compositor keeps it moving while the colour model holds the main thread.
     The wait lets it reach the screen before that work starts. */
  function showProcessingMotion() {
    compareFrame.classList.add("is-processing");
    return wait(50);
  }

  function endBusy() {
    compareFrame.classList.remove("is-processing", "is-new-photo");
    setBusy(false);
    setSlidersDisabled(false);
    if (reprocessPending) {
      reprocessPending = false;
      reprocessPhoto();
    }
  }

  /* ---------- Processing ---------- */

  function currentTuning() {
    return Core.tuningFor(Number(tuningSliders[0].input.value), Number(tuningSliders[1].input.value), Number(tuningSliders[2].input.value));
  }

  async function restoreFromSource() {
    var imageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    var restored = await Core.restoreColors(imageData.data, sourceCanvas.width, sourceCanvas.height, currentTuning());
    restoredContext.putImageData(imageData, 0, 0);
    canAdjustStrength = restored;
    return restored;
  }

  /* Sliders stay enabled while this runs, so a change made meanwhile is queued and the latest values win. */
  async function reprocessPhoto() {
    if (isBusy) {
      reprocessPending = true;
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      await showProcessingMotion();
      await restoreFromSource();
      applyStrength();
    } catch (error) {
      setErrorStatus(error, "processFailed");
    } finally {
      endBusy();
    }
  }

  async function processImage(image, userImage) {
    if (isBusy) return;
    setBusy(true);
    try {
      var naturalWidth = image.naturalWidth || image.width;
      var naturalHeight = image.naturalHeight || image.height;
      if (!naturalWidth || !naturalHeight) throw fail("unreadable");

      var size = Core.fitSize(naturalWidth, naturalHeight);
      [sourceCanvas, restoredCanvas, resultCanvas].forEach(function (canvas) {
        canvas.width = size.width;
        canvas.height = size.height;
      });
      sourceContext.drawImage(image, 0, 0, size.width, size.height);

      /* The automatic sample on page load gets no motion. A chosen photo shows untouched, with the old comparison's controls hidden. */
      var sweepDone = Promise.resolve();
      if (userImage) {
        comparisonValue = 100;
        renderComparison();
        view.caption = "captionUser";
        view.hint = "hintWorking";
        renderTexts();
        compareFrame.classList.add("is-new-photo");
        sweepDone = wait(SWEEP_MS);
        await showProcessingMotion();
      }

      var restored = await restoreFromSource();
      await sweepDone;

      comparisonValue = 50;
      applyStrength();
      view.caption = userImage ? "captionUser" : "captionSample";
      view.hint = "hintDrag";
      view.privacy = userImage ? "privacy" : "privacyStart";
      importButton.hidden = userImage;
      resultActions.hidden = !userImage;
      strengthControl.hidden = !userImage;
      renderTexts();
      setStatus(restored ? "" : "noCast");
    } catch (error) {
      setErrorStatus(error, "processFailed");
    } finally {
      endBusy();
    }
  }

  function loadImage(source) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () { resolve(image); };
      image.onerror = function () { reject(fail("openFailed")); };
      image.src = source;
    });
  }

  async function handleSelectedFile(file) {
    if (!file) return;
    if (!file.type || file.type.indexOf("image/") !== 0) {
      setStatus("notImage", null, true);
      return;
    }
    if (file.size > Core.MAX_FILE_BYTES) {
      setStatus("tooLarge", null, true);
      return;
    }
    var objectUrl = URL.createObjectURL(file);
    try {
      setStatus("");
      var image = await loadImage(objectUrl);
      await processImage(image, true);
    } catch (error) {
      setErrorStatus(error, "unreadable");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  /* ---------- Saved overlay ---------- */

  /* Two small copies of the photo, so the overlay's before-to-after wipe composites without touching the full-size canvases. */
  function drawSavedPhotos() {
    var aspect = resultCanvas.width / resultCanvas.height;
    var width = Math.min(Math.min(window.innerWidth, 560) - 72, Math.max(160, window.innerHeight * 0.44) * aspect);
    var height = width / aspect;
    var ratio = Math.min(2, window.devicePixelRatio || 1);
    [[savedBefore, sourceCanvas], [savedAfter, resultCanvas]].forEach(function (pair) {
      pair[0].width = Math.max(1, Math.round(width * ratio));
      pair[0].height = Math.max(1, Math.round(height * ratio));
      pair[0].getContext("2d").drawImage(pair[1], 0, 0, pair[0].width, pair[0].height);
    });
    savedPhoto.style.width = width + "px";
    savedPhoto.style.height = height + "px";
  }

  function fishMarkup(goesRight) {
    var flip = goesRight ? "" : " transform=\"matrix(-1 0 0 1 32 0)\"";
    return "<svg viewBox=\"0 0 32 20\"><path d=\"" + FISH_PATH + "\"" + flip + " /></svg>";
  }

  function addSavedBubbles() {
    var count;
    for (count = 0; count < 14; count += 1) {
      var size = 6 + Math.random() * 16;
      var bubble = document.createElement("span");
      bubble.className = "bubble";
      bubble.style.left = (Math.random() * 100) + "%";
      bubble.style.width = size + "px";
      bubble.style.height = size + "px";
      bubble.style.animationDuration = (5 + Math.random() * 4) + "s";
      bubble.style.animationDelay = (0.1 + Math.random() * 1.1) + "s";
      savedLife.appendChild(bubble);
    }
  }

  // 一小群鱼从照片后面游过，珊瑚色呼应“被还原的颜色”
  function addSavedFish() {
    var width = window.innerWidth;
    var y = window.innerHeight * (0.14 + Math.random() * 0.28);
    var goesRight = Math.random() < 0.5;
    var count;
    for (count = 0; count < 6; count += 1) {
      var size = 20 + Math.random() * 14;
      var lag = count * 26;
      var fish = document.createElement("span");
      fish.className = "swim-fish";
      fish.innerHTML = fishMarkup(goesRight);
      fish.style.top = (y + (Math.random() * 64 - 32)) + "px";
      fish.style.width = size + "px";
      fish.style.height = (size * 0.625) + "px";
      fish.style.fill = count % 3 === 2 ? "#d5f7f4" : "#ffb48f";
      fish.style.animationDuration = "3.6s";
      fish.style.animationDelay = (0.45 + Math.random() * 0.12) + "s";
      fish.style.setProperty("--fish-from", (goesRight ? -size - 40 - lag : width + 40 + lag) + "px");
      fish.style.setProperty("--fish-to", (goesRight ? width + 40 : -size - 40) + "px");
      fish.style.setProperty("--fish-rise", (Math.random() * 40 - 20) + "px");
      fish.style.setProperty("--fish-beat", (0.2 + Math.random() * 0.12) + "s");
      savedLife.appendChild(fish);
    }
  }

  /* Older containers and plain browsers keep the safe-area position from the CSS. */
  async function placeSavedClose() {
    var top = await platform.closeButtonTop();
    if (top) savedClose.style.top = top + "px";
  }

  /* The animations restart by themselves because the overlay comes back from display: none. */
  function showSavedOverlay() {
    window.clearTimeout(savedHideTimer);
    savedLife.innerHTML = "";
    drawSavedPhotos();
    if (!prefersReducedMotion()) {
      addSavedBubbles();
      addSavedFish();
    }
    savedOverlay.classList.remove("is-closing");
    savedOverlay.hidden = false;
    savedContent.scrollTop = 0;
    document.body.classList.add("saved-open");
    savedOverlay.focus();
    placeSavedClose();
  }

  function hideSavedOverlay() {
    savedOverlay.classList.add("is-closing");
    document.body.classList.remove("saved-open");
    savedHideTimer = window.setTimeout(function () {
      savedOverlay.hidden = true;
      savedLife.innerHTML = "";
    }, 180);
  }

  function dismissSavedOverlay() {
    hideSavedOverlay();
    saveButton.focus();
  }

  /* ---------- Save / share / comment ---------- */

  async function saveImage() {
    setResultActionsDisabled(true);
    view.saveLabel = "saving";
    saveLabel.textContent = t("saving");
    setStatus(platform.labels.savingStatus);
    try {
      var outcome = await platform.save(resultCanvas, t);
      if (outcome === "cancelled") {
        view.saveLabel = platform.labels.save;
        setStatus("");
      } else {
        view.saveLabel = platform.labels.saved;
        setStatus(platform.labels.savedStatus);
        showSavedOverlay();
      }
    } catch (error) {
      view.saveLabel = platform.labels.save;
      setErrorStatus(error, "saveFailed");
    } finally {
      saveLabel.textContent = t(view.saveLabel);
      setResultActionsDisabled(false);
    }
  }

  function shareImages() {
    var plan = Compare.layout(sourceCanvas.width, sourceCanvas.height);
    var comparison = document.createElement("canvas");
    comparison.width = plan.width;
    comparison.height = plan.height;
    Compare.draw(comparison.getContext("2d"), plan, sourceCanvas, resultCanvas, { before: t("before"), after: t("after") });
    return { comparison: comparison, before: sourceCanvas, after: resultCanvas };
  }

  /*
   * Buttons stay disabled while the images are prepared. The adapter calls ui.release() once it has handed over to
   * the platform, because some hand-offs (a post editor, a share sheet) only finish when the user leaves them.
   */
  async function runPlatformAction(kind) {
    var labelKey = kind === "share" ? "shareLabel" : "commentLabel";
    var label = kind === "share" ? shareLabel : commentLabel;
    var released = false;
    var ui = {
      t: t,
      format: t.format,
      isBusy: function () { return isBusy; },
      setStatus: function (key, params, isError) {
        if (!isBusy) setStatus(key, params, isError);
      },
      release: function () {
        if (released) return;
        released = true;
        view[labelKey] = null;
        renderTexts();
        setResultActionsDisabled(isBusy);
      }
    };
    setResultActionsDisabled(true);
    view[labelKey] = "preparing";
    label.textContent = t("preparing");
    try {
      await platform[kind](shareImages(), ui);
    } catch (error) {
      ui.release();
      if (!isBusy) setErrorStatus(error, kind === "share" ? "shareFailed" : "xhsCommentFailed");
    } finally {
      ui.release();
    }
  }

  function shareToPlatform() { return runPlatformAction("share"); }
  function postComment() { return runPlatformAction("comment"); }

  /* Hide what this platform can't do; the overlay only asks to share when there is a way to.
     share and comment are optional in an adapter: without them the buttons never show. */
  function applyCapabilities() {
    var canShare = typeof platform.share === "function" && platform.canShare();
    var canComment = typeof platform.comment === "function" && platform.canComment();
    shareButton.hidden = !canShare;
    savedShareButton.hidden = !canShare;
    if (commentButton) commentButton.hidden = !canComment;
    savedCommentButton.hidden = !canComment;
    savedAsk.hidden = !canShare && !canComment;
    savedDismissButton.setAttribute("data-i18n", canShare || canComment ? "savedDismiss" : "savedDone");
  }

  /* ---------- Ambient motion ---------- */

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  // 背景里随机游过的鱼：越小越远，因此更慢、更淡；页面隐藏时不再生成
  function startFishSpawner() {
    var ocean = document.querySelector(".ocean");
    var reef = document.querySelector(".reef");
    var hero = document.querySelector(".hero");
    var previewCard = document.querySelector(".preview-card");
    if (!ocean || !reef || !hero || !previewCard || !privacyNote || prefersReducedMotion()) return;

    var MAX_FISH = 7;
    var FISH_COLORS = ["#d5f7f4", "#d5f7f4", "#9fe3e0", "#063453"];
    var spawnTimer = null;
    var fishCount = 0;

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    // 卡片和按钮会挡住鱼，只在它们上下露出的水域里生成
    function pickSwimY() {
      var oceanTop = ocean.getBoundingClientRect().top;
      var upperTop = hero.getBoundingClientRect().top - oceanTop;
      var upperBottom = previewCard.getBoundingClientRect().top - oceanTop;
      var lowerTop = privacyNote.getBoundingClientRect().bottom - oceanTop;
      var lowerBottom = ocean.offsetHeight - 40;
      var upperSpan = Math.max(0, upperBottom - upperTop);
      var lowerSpan = Math.max(0, lowerBottom - lowerTop);
      var position = Math.random() * (upperSpan + lowerSpan);
      return position < upperSpan ? upperTop + position : lowerTop + position - upperSpan;
    }

    function addFish(options, offsetX, offsetY) {
      var size = options.size * randomBetween(0.85, 1.15);
      var width = ocean.offsetWidth;
      var fish = document.createElement("span");
      fish.className = "swim-fish";
      fish.innerHTML = fishMarkup(options.goesRight);
      fish.style.top = (options.y + offsetY) + "px";
      fish.style.width = size + "px";
      fish.style.height = (size * 0.625) + "px";
      fish.style.fill = options.color;
      fish.style.opacity = options.opacity;
      fish.style.animationDuration = options.duration + "s";
      fish.style.setProperty("--fish-from", (options.goesRight ? -size - 60 - offsetX : width + 60 + offsetX) + "px");
      fish.style.setProperty("--fish-to", (options.goesRight ? width + 60 - offsetX : -size - 60 + offsetX) + "px");
      fish.style.setProperty("--fish-rise", options.rise + "px");
      fish.style.setProperty("--fish-beat", randomBetween(0.32, 0.6) + "s");
      fish.addEventListener("animationend", function (event) {
        if (event.target !== fish) return;
        ocean.removeChild(fish);
        fishCount -= 1;
      });
      ocean.insertBefore(fish, reef);
      fishCount += 1;
    }

    function spawnFish() {
      var size = randomBetween(14, 30);
      var depth = (size - 14) / 16;
      var y = pickSwimY();
      var color = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
      // 深色鱼在深水区几乎看不见，只留在上方的亮水里
      if (color === "#063453" && y > ocean.offsetHeight / 2) color = FISH_COLORS[0];
      var options = {
        size: size,
        y: y,
        goesRight: Math.random() < 0.5,
        color: color,
        opacity: (0.26 + depth * 0.26).toFixed(2),
        duration: (ocean.offsetWidth + 120) / (16 + depth * 22 + randomBetween(0, 10)),
        rise: randomBetween(-36, 36)
      };
      var schoolSize = Math.random() < 0.3 ? Math.floor(randomBetween(2, 5)) : 1;
      for (var i = 0; i < schoolSize && fishCount < MAX_FISH; i += 1) {
        addFish(options, i * randomBetween(16, 34), i === 0 ? 0 : randomBetween(-18, 18));
      }
    }

    function scheduleNext(delay) {
      spawnTimer = window.setTimeout(function () {
        if (fishCount < MAX_FISH) spawnFish();
        scheduleNext(randomBetween(1800, 6000));
      }, delay);
    }

    document.addEventListener("visibilitychange", function () {
      window.clearTimeout(spawnTimer);
      if (!document.hidden) scheduleNext(randomBetween(400, 1800));
    });
    if (!document.hidden) scheduleNext(400);
  }

  // 轻点屏幕，在手指处放出一条鱼，受惊后游出屏幕。滑动、长按和操作控件都不算轻点
  function startTapFish() {
    var layer = document.querySelector(".tap-fish-layer");
    if (!layer || prefersReducedMotion()) return;

    var MAX_TAP_FISH = 12;
    var TAP_MAX_MOVE = 10;
    var TAP_MAX_MS = 500;
    var TAP_FISH_COLORS = ["#ffb48f", "#ffb48f", "#d5f7f4"];
    var tapStart = null;

    function addTapFish(clientX, clientY) {
      var layerRect = layer.getBoundingClientRect();
      var x = clientX - layerRect.left;
      var y = clientY - layerRect.top;
      var size = 26 + Math.random() * 12;
      var goesRight = Math.random() < 0.5;
      var distance = goesRight ? layer.offsetWidth - x + size : x + size;
      var fish = document.createElement("span");
      if (layer.children.length >= MAX_TAP_FISH) layer.removeChild(layer.firstChild);
      fish.className = "tap-fish";
      fish.innerHTML = fishMarkup(goesRight);
      fish.style.left = (x - size / 2) + "px";
      fish.style.top = (y - size * 0.3125) + "px";
      fish.style.width = size + "px";
      fish.style.height = (size * 0.625) + "px";
      fish.style.fill = TAP_FISH_COLORS[Math.floor(Math.random() * TAP_FISH_COLORS.length)];
      fish.style.animationDuration = Math.max(1.1, distance / (120 + Math.random() * 90)) + "s";
      fish.style.setProperty("--fish-dx", (goesRight ? distance : -distance) + "px");
      fish.style.setProperty("--fish-dy", (Math.random() * 90 - 45) + "px");
      fish.style.setProperty("--fish-beat", (0.16 + Math.random() * 0.1) + "s");
      fish.addEventListener("animationend", function (event) {
        if (event.target === fish && fish.parentNode) fish.parentNode.removeChild(fish);
      });
      layer.appendChild(fish);
    }

    document.addEventListener("pointerdown", function (event) {
      var onControl = event.target.closest && event.target.closest("button, input, .compare-divider, .saved-overlay");
      tapStart = event.isPrimary && event.button === 0 && !onControl
        ? { x: event.clientX, y: event.clientY, time: Date.now() }
        : null;
    });
    document.addEventListener("pointercancel", function () {
      tapStart = null;
    });
    document.addEventListener("pointerup", function (event) {
      if (!tapStart || !event.isPrimary) return;
      var isTap = Math.abs(event.clientX - tapStart.x) <= TAP_MAX_MOVE
        && Math.abs(event.clientY - tapStart.y) <= TAP_MAX_MOVE
        && Date.now() - tapStart.time <= TAP_MAX_MS;
      tapStart = null;
      if (isTap) addTapFish(event.clientX, event.clientY);
    });
  }

  /* ---------- Wiring ---------- */

  compareDivider.addEventListener("pointerdown", startDividerDrag);
  compareDivider.addEventListener("pointermove", moveDividerDrag);
  compareDivider.addEventListener("pointerup", stopDividerDrag);
  compareDivider.addEventListener("pointercancel", stopDividerDrag);
  compareDivider.addEventListener("keydown", moveDividerByKeyboard);
  tuningSliders.forEach(function (slider) {
    updateTuningDisplay(slider);
    slider.input.addEventListener("input", function () {
      updateTuningDisplay(slider);
    });
    slider.input.addEventListener("change", reprocessPhoto);
  });
  strengthInput.addEventListener("input", function () {
    updateStrengthDisplay();
    applyStrength();
    view.saveLabel = platform.labels.save;
    saveLabel.textContent = t(view.saveLabel);
  });
  function openPhotoPicker() {
    if (!isBusy) photoInput.click();
  }
  importButton.addEventListener("click", openPhotoPicker);
  anotherButton.addEventListener("click", openPhotoPicker);
  photoInput.addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    handleSelectedFile(file);
    photoInput.value = "";
  });
  saveButton.addEventListener("click", saveImage);
  shareButton.addEventListener("click", shareToPlatform);
  if (commentButton) commentButton.addEventListener("click", postComment);
  if (languageSelect) languageSelect.addEventListener("change", switchLanguage);
  savedCommentButton.addEventListener("click", function () {
    hideSavedOverlay();
    postComment();
  });
  savedShareButton.addEventListener("click", function () {
    hideSavedOverlay();
    shareToPlatform();
  });
  savedDismissButton.addEventListener("click", dismissSavedOverlay);
  savedClose.addEventListener("click", dismissSavedOverlay);
  savedContent.addEventListener("click", function (event) {
    if (event.target === savedContent || event.target === savedInner) dismissSavedOverlay();
  });
  savedOverlay.addEventListener("keydown", function (event) {
    if (event.key === "Escape") dismissSavedOverlay();
  });

  view.saveLabel = platform.labels.save;
  applyCapabilities();
  buildLanguageMenu();
  applyLanguage();
  updateStrengthDisplay();
  sampleImage.onload = function () { processImage(sampleImage, false); };
  sampleImage.onerror = function () { setStatus("sampleFailed", null, true); };
  sampleImage.src = "./assets/sample.jpg";
  startFishSpawner();
  startTapFish();
}());
