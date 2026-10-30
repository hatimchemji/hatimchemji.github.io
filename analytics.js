/* Activer uniquement après vérification du mode CNIL dans Matomo. */
(() => {
  'use strict';
  const CNIL_CONFIGURATION_VERIFIED = false;
  const base = 'https://hatimchemji.matomo.cloud/';
  const key = 'hc_audience_optout';
  const queue = window._paq = window._paq || [];
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  let loaded = false, memoryOptOut = false;
  function optedOut() {
    const cookie = document.cookie.split(';').some(c => c.trim() === key + '=1');
    let previousRefusal = false;
    try {
      const old = JSON.parse(localStorage.getItem('hatim-analytics-choice-v1'));
      previousRefusal = old?.accept === false && old.expires > Date.now();
    } catch {}
    return memoryOptOut || cookie || previousRefusal;
  }
  function eligible() { return CNIL_CONFIGURATION_VERIFIED && !dnt && !optedOut(); }
  function start() {
    if (!eligible()) return;
    if (!loaded) {
      queue.push(['disableCookies'], ['disableBrowserFeatureDetection'], ['setDoNotTrack', true],
        ['setTrackerUrl', base + 'matomo.php'], ['setSiteId', '1'],
        ['setCustomUrl', 'https://hatimchemji.github.io/'],
        ['setDocumentTitle', 'Portfolio Hatim CHEMJI'], ['setReferrerUrl', ''], ['trackPageView']);
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://cdn.matomo.cloud/hatimchemji.matomo.cloud/matomo.js';
      script.referrerPolicy = 'no-referrer';
      document.head.appendChild(script);
      loaded = true;
    } else queue.push(['forgetUserOptOut'], ['trackPageView']);
  }
  function event(category, action, name) {
    if (eligible()) queue.push(['trackEvent', category, action, name]);
  }
  const policy = document.createElement('dialog');
  policy.id = 'hc-audience-policy';
  policy.setAttribute('aria-labelledby', 'hc-audience-title');
  policy.innerHTML = '<div style="padding:24px;max-width:650px"><h2 id="hc-audience-title">Confidentialité</h2><p>Responsable : Hatim CHEMJI — hatimchemji00@gmail.com.</p><p>Ce portfolio utilise une mesure d’audience limitée aux statistiques globales de consultation et d’utilisation de ses fonctionnalités. Prestataire : Matomo Cloud, instance hatimchemji.matomo.cloud.</p><p>Aucun nom, e-mail, contenu saisi, identifiant de compte ou paramètre de campagne n’est envoyé par ce module. Aucun cookie de suivi, enregistrement de session ou suivi entre sites n’est activé. La connexion au prestataire lui transmet techniquement votre IP ; le mode CNIL de Matomo en limite le traitement et restreint les rapports à des statistiques agrégées.</p><p>La mesure est activée uniquement après vérification des réglages de l’instance pour l’exemption de consentement. La durée de conservation est limitée à 25 mois au maximum par ces réglages. Pour exercer vos droits, demander un effacement ou connaître les réglages appliqués, contactez le responsable. Vous pouvez adresser une réclamation à la CNIL.</p><p>Vous pouvez vous opposer à cette mesure ci-dessous. Un cookie mémorise votre opposition pendant 180 jours dans ce navigateur. Le signal « Ne pas suivre » est respecté. GitHub héberge le site et traite ses propres journaux techniques.</p><p role="status" data-status></p><button class="btn btn-outline" type="button" data-optout></button><form method="dialog" style="margin-top:16px"><button class="btn btn-outline">Fermer</button></form></div>';
  document.body.appendChild(policy);
  const preferences = document.createElement('button');
  preferences.type = 'button';
  preferences.textContent = 'Confidentialité';
  preferences.className = 'btn btn-outline';
  preferences.style.margin = '14px';
  (document.querySelector('footer') || document.body).appendChild(preferences);
  const status = policy.querySelector('[data-status]');
  const button = policy.querySelector('[data-optout]');
  function refresh() {
    status.textContent = !CNIL_CONFIGURATION_VERIFIED ? 'Mesure d’audience actuellement désactivée.' : dnt ? 'Mesure désactivée par la préférence de votre navigateur.' : optedOut() ? 'Vous êtes exclu de la mesure d’audience.' : 'La mesure d’audience est active.';
    button.textContent = optedOut() ? 'Autoriser la mesure d’audience' : 'M’opposer à la mesure d’audience';
    button.disabled = dnt || !CNIL_CONFIGURATION_VERIFIED;
  }
  preferences.addEventListener('click', () => { refresh(); policy.showModal(); });
  button.addEventListener('click', () => {
    const decline = !optedOut();
    memoryOptOut = decline;
    document.cookie = key + '=' + (decline ? '1' : '') + '; Max-Age=' + (decline ? 15552000 : 0) + '; Path=/; SameSite=Lax; Secure';
    try { localStorage.removeItem('hatim-analytics-choice-v1'); } catch {}
    if (decline && loaded) queue.push(['optUserOut']);
    if (!decline) start();
    refresh();
  });
  window.addEventListener('storage', e => {
    if (e.key === 'hatim-analytics-choice-v1' && !eligible() && loaded) queue.push(['optUserOut']);
  });
  start();
  document.addEventListener('click', e => {
    if (!eligible() || !(e.target instanceof Element)) return;
    const el = e.target.closest('a,button'); if (!el) return;
    if (el.closest('#hc-audience-policy') || el === preferences) return;
    if (el.matches('[data-contact-open]')) return event('Contact', 'ouvrir', 'coordonnees');
    if (el.matches('[data-filter]')) {
      const value = el.dataset.filter;
      if (['all','grc','offensive','defensive','appsec','devsecops'].includes(value)) event('Projets', 'filtrer', value);
      return;
    }
    if (el.id === 'menuToggle') return event('Navigation', 'menu', 'mobile');
    if (!el.matches('a')) return;
    const href = el.getAttribute('href') || '';
    if (/^mailto:/i.test(href)) return event('Contact', 'clic', 'email');
    if (/^tel:/i.test(href)) return event('Contact', 'clic', 'telephone');
    if (href.startsWith('#')) {
      if (['#accueil','#apropos','#experiences','#projets','#competences','#certifications','#contact'].includes(href)) event('Navigation', 'section', href.slice(1));
      return;
    }
    let url; try { url = new URL(href, location.href); } catch { return; }
    if (!['http:','https:'].includes(url.protocol)) return;
    if (/\.pdf$/i.test(url.pathname) || el.hasAttribute('download')) return event('Documents', 'clic', /cv/i.test(url.pathname) ? 'cv' : 'document');
    if (/(^|\.)linkedin\.com$/.test(url.hostname)) return event('Contact', 'clic', 'linkedin');
    if (url.origin !== location.origin) event('Liens', 'sortant', url.hostname);
  });
  document.addEventListener('toggle', e => {
    if (e.target instanceof HTMLDetailsElement && e.target.open) event('Projets', 'details', 'ouvrir');
  }, true);

})();
