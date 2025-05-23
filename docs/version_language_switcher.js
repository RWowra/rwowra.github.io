// =================================
// Configuration section
// Must be edited with every release
// =================================

// List of available versions. Each version includes:
// - the display name (version)
// - the path to its default language (English) landing page
// - a flag indicating if it's the latest version
const versions = [
  {
    version: 'V1.0',
    path: '/docs/V1.0/EN/Content/Resources/Manual/LandingPage_DataOperator.htm',
    isLatest: false
  },
  {
    version: 'V1.1',
    path: '/docs/V1.1/EN/Content/Resources/Manual/LandingPage_DataOperator.htm',
    isLatest: false
  },
  {
    version: 'V1.2',
    path: '/docs/V1.2/EN/Content/Resources/Manual/LandingPage_DataOperator.htm',
    isLatest: true
  }
];

// List of available languages. Each language includes:
// - a code that matches the language folder in the URL
// - the label to be shown in the dropdown
const languages = [
  { code: "EN", label: "English" },
  { code: "DE", label: "Deutsch" },
  { code: "FR", label: "Français" },
  { code: "JP", label: "日本語" }
];

// Define the fallback language in case no language folder is found in the URL
const defaultLanguage = "EN";

// ============================
// ============================
// NO EDITING ABOVE THIS POINT!
// ============================
// ============================

// =================
// Utility Functions
// =================

// Extracts the current version from the URL.
// If the URL matches a known landing page path, it returns the corresponding version.
// If the folder is 'Current', it returns the version marked as isLatest.
// If no match is found, returns "Unknown version".
function getCurrentVersion() {
  const path = window.location.pathname;

  for (const version of versions) {
    if (path.includes(version.path)) return version.version;
  }

  const parts = path.split("/");
  const docsIndex = parts.indexOf("docs");
  const versionFolder = parts[docsIndex + 1];

  if (versionFolder === "Current") {
    const latest = versions.find(v => v.isLatest);
    return latest ? latest.version : "Unknown version";
  }

  const found = versions.find(v => v.path.includes(`/docs/${versionFolder}/`));
  return found ? found.version : "Unknown version";
}

// Extracts the current language from the URL.
// It expects the language code to appear directly after the version folder.
// If no valid language is found, it returns the defaultLanguage.
function getCurrentLanguage() {
  const pathParts = window.location.pathname.split("/");
  const docsIndex = pathParts.indexOf("docs");
  const languageFolder = pathParts[docsIndex + 2];
  const lang = languages.find(lang => lang.code === languageFolder);
  return lang ? lang.code : defaultLanguage;
}

// Adds "(Latest)" label to the version name if it is marked as latest.
function formatLatestVersion(versionName) {
  const version = versions.find(v => v.version === versionName);
  return version && version.isLatest ? `${versionName} (Latest)` : versionName;
}

// ====================
// Initialize dropdowns
// ====================

// Initializes version and language dropdowns after the page has fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  // Initialize both version dropdowns
  initDropdown(document.getElementById("currentVersion1"), document.getElementById("versionDropdown1"), true);
  initDropdown(document.getElementById("currentVersion2"), document.getElementById("versionDropdown2"), true);

  // Initialize both language dropdowns
  initDropdown(document.getElementById("currentLanguage1"), document.getElementById("languageDropdown1"), false);
  initDropdown(document.getElementById("currentLanguage2"), document.getElementById("languageDropdown2"), false);
});

// ================================
// Dropdown Initialization Function
// ================================

// Initializes a single dropdown. Handles both version and language types.
// Params:
// - currentEl: the DOM element showing the current version/language
// - dropdownEl: the container with the dropdown options
// - isVersion: boolean flag to distinguish between version and language logic
function initDropdown(currentEl, dropdownEl, isVersion) {
  const currentValue = isVersion ? getCurrentVersion() : getCurrentLanguage();
  const items = isVersion ? versions : languages;

  // Set and display the current value in the dropdown trigger element
  if (currentEl && currentValue) {
    const currentDisplay = isVersion && items.find(v => v.version === currentValue && v.isLatest)
      ? `${currentValue} (Latest)`
      : items.find(i => (isVersion ? i.version : i.code) === currentValue)?.label || currentValue;

    currentEl.textContent = currentDisplay;

    // Toggle dropdown visibility on click
    currentEl.addEventListener("click", function () {
      dropdownEl.classList.toggle("show-dropdown");
    });
  }

  // Populate the dropdown with options
  if (dropdownEl) {
    items.forEach(item => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = isVersion
        ? item.isLatest ? `${item.version} (Latest)` : item.version
        : item.label;

      // Handle click on dropdown option
      
link.onclick = function (e) {
  e.preventDefault();

  const pathParts = window.location.pathname.split("/");
  const docsIndex = pathParts.indexOf("docs");
  const currentVersion = pathParts[docsIndex + 1];
  const possibleLang = pathParts[docsIndex + 2];
  const isLangValid = languages.some(lang => lang.code === possibleLang);
  const currentLanguage = isLangValid ? possibleLang : defaultLanguage;

  let targetVersion = currentVersion;
  let targetLanguage = currentLanguage;

  if (isVersion) {
    targetVersion = item.version;
  } else {
    targetLanguage = item.code;
  }

  const remainingPath = pathParts.slice(docsIndex + 3).join("/");
  const basePath = `/docs/${targetVersion}/${targetLanguage}/${remainingPath}`;

  const versionEntry = versions.find(v => v.version === targetVersion);
  const landingEN = versionEntry?.path;
  const landingLang = landingEN?.replace(`/${defaultLanguage}/`, `/${targetLanguage}/`);

  if (isVersion) {
    fetch(basePath, { method: 'HEAD' }).then(res => {
      if (res.ok) {
        window.location.pathname = basePath;
      } else {
        fetch(landingLang, { method: 'HEAD' }).then(res2 => {
          if (res2.ok) {
            window.location.pathname = landingLang;
          } else {
            window.location.pathname = landingEN;
          }
        }).catch(() => {
          window.location.pathname = landingEN;
        });
      }
    }).catch(() => {
      window.location.pathname = landingEN;
    });
  } else {
    const languageFallback = `/docs/${targetVersion}/${defaultLanguage}/${remainingPath}`;
    fetch(basePath, { method: 'HEAD' }).then(res => {
      if (res.ok) {
        window.location.pathname = basePath;
      } else {
        window.location.pathname = languageFallback;
      }
    }).catch(() => {
      window.location.pathname = languageFallback;
    });
  }
};


      dropdownEl.appendChild(link);
    });
  }

  // Close the dropdown if clicking outside of it
  document.addEventListener("click", function (event) {
    if (!currentEl.contains(event.target) && !dropdownEl.contains(event.target)) {
      dropdownEl.classList.remove("show-dropdown");
    }
  });
}
