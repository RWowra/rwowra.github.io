document.addEventListener("DOMContentLoaded", function () {
  const dockPrivacySettings = document.createElement("dock-privacy-settings");

  Object.assign(dockPrivacySettings, {
    linkUrlMarketing: "/ww/en/data-protection-policy/",
    linkUrlComfort: "/ww/en/data-protection-policy/",
    linkUrlImprint: "/ww/en/corporate-information/",
    linkUrlPolicy: "/ww/en/data-protection-policy/",
    consentCategories: "marketing,analysis"
  });

  document.body.appendChild(dockPrivacySettings);

  window.showDockPrivacySettings = async function () {
    await customElements.whenDefined("dock-privacy-settings");
    dockPrivacySettings.setAttribute("visible", "true");
  };

  window.BoschPrivacyCallback_OnUpdate = function (a) {
    if (a.marketing && a.analysis) {
      console.log("[callback] marketing and analysis are on");
      dataLayer.push({ event: "bosch_privacy_update_marketing_on" });
      dataLayer.push({ event: "bosch_privacy_update_analysis_on" });
    } else if (a.marketing) {
      console.log("[callback] marketing is on");
      dataLayer.push({ event: "bosch_privacy_update_marketing_on" });
    } else if (a.analysis) {
      console.log("[callback] analysis is on");
      dataLayer.push({ event: "bosch_privacy_update_analysis_on" });
    } else {
      console.log("[callback] marketing and analysis are off");
    }
  };
});

