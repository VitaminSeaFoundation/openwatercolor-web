/*
 * Platform adapter: a normal, independently hosted website.
 * Built into assets/platform.js for the web target. Contract: "Platform adapters" in README.md.
 *
 * Save: on phones the system sheet that holds "Save Image", elsewhere a file download.
 * No share or comment features: those buttons stay hidden on this build.
 */
(function () {
  "use strict";

  var LANGUAGE_KEY = "openwatercolor.language";

  function storage() {
    try { return window.localStorage; } catch (error) { return null; }
  }

  function isTouchDevice() {
    return !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error("toBlob failed"));
        }, "image/jpeg", 0.92);
        return;
      }
      // Old browsers without toBlob: decode the data URL.
      var parts = canvas.toDataURL("image/jpeg", 0.92).split(",");
      var binary = atob(parts[1]);
      var bytes = new Uint8Array(binary.length);
      for (var index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
      resolve(new Blob([bytes], { type: "image/jpeg" }));
    });
  }

  function toFile(blob, name) {
    try { return new File([blob], name, { type: "image/jpeg" }); } catch (error) { return null; }
  }

  function canShareFiles(files) {
    return !!(navigator.share && navigator.canShare && files && navigator.canShare({ files: files }));
  }

  function isAbort(error) {
    return !!error && error.name === "AbortError";
  }

  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function fileName(t) {
    var stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
    return t("webFileName") + "-" + stamp + ".jpg";
  }

  window.UnderwaterPlatform = {
    id: "web",

    languageCandidates: function () {
      var candidates = [];
      var match = /[?&]lang=([^&#]+)/.exec(window.location.search);
      if (match) candidates.push(decodeURIComponent(match[1]));
      var store = storage();
      var saved = store && store.getItem(LANGUAGE_KEY);
      if (saved) candidates.push(saved);
      return candidates.concat(navigator.languages || [], navigator.language || []);
    },

    rememberLanguage: function (code) {
      var store = storage();
      try { if (store) store.setItem(LANGUAGE_KEY, code); } catch (error) {}
    },

    labels: {
      save: "webSave",
      saved: "webSaved",
      savingStatus: "webSavingStatus",
      savedStatus: "webSavedStatus"
    },

    canShare: function () { return false; },
    canComment: function () { return false; },

    /* On phones the system sheet is the only way to reach "Save Image"; resolves "cancelled" if it is closed. */
    save: function (canvas, t) {
      return canvasToBlob(canvas).then(function (blob) {
        var name = fileName(t);
        var file = isTouchDevice() ? toFile(blob, name) : null;
        if (file && canShareFiles([file])) {
          return navigator.share({ files: [file] }).then(null, function (error) {
            if (isAbort(error)) return "cancelled";
            download(blob, name);
          });
        }
        download(blob, name);
      });
    },

    closeButtonTop: function () {
      return Promise.resolve(null);
    }
  };
}());
