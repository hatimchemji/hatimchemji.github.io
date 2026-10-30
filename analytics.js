/* Matomo : renseigner ces deux valeurs publiques après création du site. */
(() => {
  'use strict';
  const MATOMO_URL = ''; // Exemple : https://votre-instance.matomo.cloud/
  const SITE_ID = ''; // Numéro fourni par Matomo. Ne jamais mettre de token API ici.
  if (!MATOMO_URL || !/^[1-9]\d*$/.test(SITE_ID)) return;
  let endpoint;
  try { endpoint = new URL(MATOMO_URL); } catch { return; }
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) return;
  const base = endpoint.href.replace(/\/?$/, '/');
  const key = 'hatim-analytics-choice-v1';
  const lifetime = 180 * 86400000;
  let accepted = false, loaded = false, memoryChoice = null;
  const queue = window._paq = window._paq || [];
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  function choice() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value.accept === 'boolean' && value.expires > Date.now() ? value.accept : null;
    } catch { return memoryChoice; }
  }
  function event(category, action, name) {
    if (accepted && choice() === true) queue.push(['trackEvent', category, action, name]);
  }
  function grant() {
    if (accepted || dnt) return;
    accepted = true;
    if (!loaded) {
      queue.push(['requireConsent'], ['disableCookies'], ['setDoNotTrack', true],
        ['setTrackerUrl', base + 'matomo.php'], ['setSiteId', SITE_ID],
        ['setCustomUrl', location.origin + location.pathname],
        ['setDocumentTitle', 'Portfolio Hatim CHEMJI']);
      // Conserver uniquement le domaine de provenance, sans chemin ni paramètres.
      let referrer = '';
      try { referrer = document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch {}
      queue.push(['setReferrerUrl', referrer], ['setConsentGiven'], ['trackPageView']);
      const script = document.createElement('script');
      script.async = true; script.src = base + 'matomo.js';
      script.referrerPolicy = 'no-referrer';
      document.head.appendChild(script);
      loaded = true;
    } else queue.push(['setConsentGiven'], ['trackPageView']);
  }
  function revoke() {
    accepted = false;
    if (loaded) queue.push(['forgetConsentGiven']);
  }
  const style = document.createElement('style');
  style.textContent = `#hc-privacy[hidden]{display:none}#hc-privacy{position:fixed;bottom:18px;left:18px;right:18px;max-width:650px;z-index:1000;padding:22px;background:#101b2c;color:#fff;border:1px solid #466879;border-radius:16px;box-shadow:0 8px 35px #0008}#hc-privacy p{margin:8px 0 16px;font-size:14px}#hc-privacy-actions{display:flex;gap:12px;flex-wrap:wrap}#hc-privacy button,#hc-privacy-link{cursor:pointer;padding:8px 15px;border:1px solid #7bbab9;border-radius:8px;background:#172f3a;color:#fff}#hc-privacy button:focus-visible,#hc-privacy-link:focus-visible{outline:3px solid #8de5d1;outline-offset:3px}#hc-privacy-link{margin:14px;font-size:13px}`;
  document.head.appendChild(style);
  const banner = document.createElement('section');
  banner.id = 'hc-privacy'; banner.setAttribute('aria-label', 'Préférences de statistiques');
  banner.innerHTML = '<strong>Statistiques de visite</strong><p>Avec votre accord, Hatim CHEMJI utilise Matomo pour mesurer les visites et les clics sur ce portfolio. Aucun nom, e-mail ou contenu saisi dans un formulaire n’est collecté par ce suivi. Vous pouvez refuser et changer votre choix à tout moment.</p><p>La connexion au service transmet votre adresse IP ; son masquage est configuré côté Matomo. Le choix est conservé 6 mois dans ce navigateur.</p><div id="hc-privacy-actions"><button type="button" data-choice="yes">Accepter</button><button type="button" data-choice="no">Refuser</button><button type="button" data-policy>Confidentialité</button></div>';
  document.body.appendChild(banner);
  const policy = document.createElement('dialog');
  policy.setAttribute('aria-label', 'Confidentialité des statistiques');
  policy.innerHTML = '<div style="padding:24px;max-width:650px"><h2>Confidentialité</h2><p>Responsable : Hatim CHEMJI — hatimchemji00@gmail.com.</p><p>Finalité : comprendre la fréquentation et l’utilisation de ce portfolio. Base du suivi facultatif : votre consentement, révocable via « Statistiques et confidentialité ».</p><p>Données : pages consultées, date, clics, domaine de provenance, informations techniques du navigateur et localisation approximative selon la configuration de Matomo. Ces informations ne révèlent pas automatiquement votre identité. Aucun enregistrement de session ou de frappe clavier n’est activé.</p><p>Prestataire de mesure : Matomo. Instance : <span data-instance></span>. Conservation des données de visite : 90 jours ; choix du navigateur : 180 jours. Les statistiques agrégées peuvent être conservées plus longtemps.</p><p>Pour exercer vos droits d’accès, d’effacement ou de retrait du consentement, contactez hatimchemji00@gmail.com. Vous pouvez également adresser une réclamation à la CNIL. GitHub assure l’hébergement du portfolio et traite ses propres journaux techniques.</p><form method="dialog"><button class="btn btn-outline">Fermer</button></form></div>';
  policy.querySelector('[data-instance]').textContent = endpoint.hostname;
  document.body.appendChild(policy);
  banner.querySelector('[data-policy]').addEventListener('click', () => policy.showModal());
  const preferences = document.createElement('button');
  preferences.type = 'button'; preferences.id = 'hc-privacy-link';
  preferences.textContent = 'Statistiques et confidentialité';
  (document.querySelector('footer') || document.body).appendChild(preferences);
  preferences.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });
  banner.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    const allow = button.dataset.choice === 'yes' && !dnt;
    memoryChoice = allow;
    try { localStorage.setItem(key, JSON.stringify({accept: allow, expires: Date.now() + lifetime})); } catch {}
    allow ? grant() : revoke(); banner.hidden = true; preferences.focus();
  }));
  const remembered = choice();
  banner.hidden = remembered !== null || dnt;
  if (remembered === true && !dnt) grant();
  // Synchroniser le retrait du consentement entre les onglets.
  window.addEventListener('storage', e => {
    if (e.key !== key && e.key !== null) return;
    const allow = choice();
    if (allow === true && !dnt) grant(); else revoke();
    banner.hidden = allow !== null || dnt;
  });
  // Une session expirée ne doit plus envoyer d’événements.
  setInterval(() => { if (accepted && choice() !== true) { revoke(); banner.hidden = false; } }, 60000);
  document.addEventListener('click', e => {
    if (!accepted || !(e.target instanceof Element)) return;
    const el = e.target.closest('a,button'); if (!el) return;
    if (el.closest('#hc-privacy') || el.closest('dialog[aria-label="Confidentialité des statistiques"]') || el === preferences) return;
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
