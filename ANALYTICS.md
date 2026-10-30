# Suivi du portfolio — Matomo Cloud

Le suivi est configuré pour https://hatimchemji.matomo.cloud/, site n° 1, et ne démarre qu’après acceptation du visiteur. L’activation de cette destination a été autorisée par le propriétaire. Le fichier index.html reprend le HTML téléchargé de votre portfolio ; seul un chargement de analytics.js a été ajouté. Conserver tous les assets existants dans le dépôt.

## 1. Configurer Matomo
Créer ou utiliser une instance Matomo hébergée ou auto-hébergée. Ajouter le site https://hatimchemji.github.io/. Récupérer l’URL HTTPS de l’instance et le numéro du site, disponibles dans le code de suivi. Ne transmettre aucun mot de passe ni token API. Les deux valeurs publiques suffisent pour finaliser le code.

Dans analytics.js, renseigner MATOMO_URL et SITE_ID en tête de fichier. Sans ces valeurs, aucun service de statistiques n’est chargé et aucune bannière n’apparaît.

Avant activation, dans Matomo : masquer les IP (au moins 2 octets, voire intégralement selon le besoin), supprimer automatiquement les journaux de visites au bout de 90 jours, vérifier l’accès privé au tableau de bord et compléter la notice avec l’entité du prestataire, son hébergement et les éventuels transferts. La notice livrée est un modèle à adapter à cette instance réelle. Ne pas activer User ID, empreinte navigateur, enregistrement de sessions ou capture de formulaires. Le réglage du masquage et de la conservation est côté serveur, pas dans le JavaScript.

## 2. Mettre en ligne
Option directe : renseigner les valeurs Matomo sur cette branche, vérifier les réglages serveur et fusionner la pull request vers main pour déployer via GitHub Pages.
Option manuelle : dans le dépôt GitHub, Add file > Upload files ; glisser index.html et analytics.js à la racine puis Commit changes. Ne pas supprimer les assets existants. Attendre la fin du déploiement GitHub Pages.

## 3. Vérifier
Ouvrir le portfolio dans une fenêtre privée, sans bloqueur, avec Do Not Track désactivé pour ce test. Avant choix et après Refuser, aucune requête vers l’instance Matomo ne doit partir. Accepter : le navigateur charge matomo.js puis envoie la page à matomo.php. Cliquer sur LinkedIn, Me contacter et un filtre de projets. Vérifier les événements dans le tableau de bord Matomo. Ouvrir Statistiques et confidentialité puis Refuser : les clics suivants ne doivent plus produire de suivi. Tester aussi une actualisation après refus et après acceptation.

## Mesures préparées
Visite de page ; domaine de provenance sans chemin ni paramètres ; clic LinkedIn/e-mail/téléphone ; ouverture de la fenêtre de contact ; navigation entre sections ; filtres de projets ; ouverture des détails ; liens sortants ; clic sur document PDF si un lien existe. Aucun bouton CV ni formulaire n’a été ajouté. Le site actuel n’expose pas de lien de CV actif dans le HTML récupéré. Un clic document ne prouve pas un téléchargement réussi.

## Limites
Ce suivi démarre après activation et consentement ; il ne reconstruit pas les visites passées. Les bloqueurs et robots peuvent modifier les décomptes. Aucun nom ou e-mail de visiteur n’est déduit. L’IP n’est pas une identité ni une adresse postale. Pas de promesse d’anonymat : Matomo reçoit l’IP lors de la connexion et peut traiter d’autres données techniques. Le navigateur conserve uniquement le choix de suivi pendant 180 jours. Le signal Do Not Track / Global Privacy Control bloque le suivi. En cas de stockage local indisponible, un accord reste valable pour la page courante, avec retrait possible ; il n’est pas mémorisé après fermeture.

Documentation : https://matomo.org/faq/general/configure-privacy-settings-in-matomo/ et https://developer.matomo.org/guides/tracking-javascript-guide


## État de la configuration
MATOMO_URL et SITE_ID sont renseignés. Le script est chargé depuis le CDN Matomo indiqué par le code d’installation du compte. Le masquage des IP et la conservation de 90 jours sont des réglages serveur recommandés, non vérifiés par cette intégration. La notice ne les présente pas comme déjà appliqués. Vérifier ces paramètres dans Matomo et préciser ensuite les durées réelles dans la notice.
