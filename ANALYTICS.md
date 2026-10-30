# Mesure d’audience sans bannière — configuration en attente

Cette branche prépare des statistiques globales de consultation et de clics. Elle ne permet pas d’identifier les visiteurs. Aucun suivi n’est envoyé tant que CNIL_CONFIGURATION_VERIFIED reste false dans analytics.js. Le site en ligne demeure sans suivi jusqu’à la publication.

## Réglages serveur indispensables
Dans Matomo, connecté en superutilisateur : Administration > Privacy/Confidentialité > Compliance/Conformité. Choisir le site 1 (hatimchemji.github.io), activer Enforce compliance where possible et enregistrer. Examiner la totalité de l’auto-évaluation et résoudre les éléments Unknown/non-compliant, y compris le mécanisme d’opposition. Ne pas activer d’imports externes ou d’intégrations publicitaires.

Le mode doit notamment restreindre les rapports aux statistiques agrégées, désactiver journaux de visites/profils individuels et sessions, masquer les IP, minimiser les données techniques et imposer les limites de conservation. Vérifier les effets annoncés avant d’enregistrer, notamment si une fonction existante doit être supprimée. Ne pas affirmer la conformité globale du site sur le seul résultat de cet outil.

Documentation officielle : https://fr.matomo.org/faq/how-do-i-configure-matomo-without-tracking-consent-for-french-visitors-cnil-exemption/

## Comportement du code
Pas de bannière ni de demande d’acceptation. Un bouton Confidentialité dans le pied de page ouvre la notice et le mécanisme d’opposition. Le refus est conservé 180 jours par un cookie de préférence. Les refus antérieurs encore valides sont respectés. Do Not Track et Global Privacy Control désactivent la mesure. Les cookies de suivi et la détection des fonctionnalités du navigateur sont désactivés. Pas d’identifiant personnel, formulaire, référent, paramètre de campagne ou URL arbitraire transmis par le module. Événements limités à la présence sur la page et à l’utilisation des boutons/liens.

## Activation finale
Après vérification des réglages serveur et de la notice, passer CNIL_CONFIGURATION_VERIFIED à true et publier la branche. Confirmer les rapports agrégés dans Matomo. Tester l’opposition : après clic sur M’opposer à la mesure d’audience, aucun événement supplémentaire ne doit partir, y compris après actualisation. Vérifier que les rapports individuels ne sont pas accessibles. Sans vérification serveur, laisser le module désactivé.

La préparation technique ne garantit pas l’exemption de consentement : elle dépend de l’ensemble des critères de l’auto-évaluation et des usages réels de l’instance.
