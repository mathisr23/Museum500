---
title: "Knight Capital — 440 millions en 45 minutes"
shortName: "Knight Capital"
date: "2012-08-01"
category: "finance"
tagline: "Un flag oublié sur un seul des huit serveurs a fait couler une firme de Wall Street."
damages:
  duration: "45 minutes"
  impact: "4 millions de transactions erronées sur 154 actions"
  cost: "440 M$ — faillite en 48h"
postMortemUrl: "https://www.sec.gov/litigation/admin/2013/34-70694.pdf"
culpritCode:
  language: "context"
  snippet: "// SMARS code path activé par le flag 'Power Peg'\n// Désactivé depuis 2003.\n// Code mort jamais supprimé.\nif (flagPowerPeg) { executeAggressiveBuyStrategy(); }"
  annotation: "Le flag 'Power Peg' a été réutilisé en 2012 pour une autre fonction. Le déploiement n'a pas couvert les 8 serveurs."
timeline:
  - time: "T-1 semaine"
    event: "Knight déploie un nouveau code SMARS pour participer au programme RLP du NYSE."
  - time: "T-0"
    event: "7 des 8 serveurs reçoivent le nouveau code. Le 8e est oublié."
  - time: "09:30 ET"
    event: "Ouverture de marché. Le 8e serveur active 'Power Peg' — un code mort de 2003 — qui se met à acheter haut et vendre bas en boucle."
  - time: "09:35 ET"
    event: "Volume anormal détecté. 4 millions de trades en 45 minutes."
  - time: "10:15 ET"
    event: "Knight identifie la source et arrête le système."
  - time: "T+48h"
    event: "Knight Capital sauvée par un consortium d'investisseurs. La firme disparaît dans Getco fin 2012."
testimonies:
  - source: "SEC Order Cease and Desist"
    quote: "Knight n'avait aucun système de contrôle automatique pour empêcher ce type d'erreur. Aucun rate-limit, aucun kill-switch."
    url: "https://www.sec.gov/litigation/admin/2013/34-70694.pdf"
lessons:
  - title: "Le code mort tue."
    body: "Garder du code inutilisé pendant 9 ans 'au cas où' a coûté 440 M$. Supprimez."
  - title: "Le déploiement doit être atomique."
    body: "7/8 serveurs ne suffit pas. Les déploiements partiels doivent être détectés et bloqués."
  - title: "Réutiliser un flag est un piège."
    body: "Un flag déprécié ne devrait jamais retrouver une nouvelle sémantique. Renommez."
---

Le 1er août 2012, Knight Capital Group — l'un des principaux teneurs de marché du NYSE — déploie une mise à jour de son système de routage d'ordres SMARS pour participer au nouveau programme Retail Liquidity Program du NYSE.

Le déploiement échoue silencieusement sur l'un des huit serveurs de production. Personne ne le remarque.

À 9h30, l'ouverture de marché transforme ce serveur orphelin en machine à brûler de l'argent : il active un code de 2003, *Power Peg*, dont le rôle initial était de tester le système avec des trades volontairement non-rentables. En production, à pleine vitesse, sur de vraies actions.

En 45 minutes, Knight prend des positions massives sur 154 titres. Le marché bouge. À 10h15, quand l'équipe coupe le système, la perte est de 440 millions de dollars. La firme, qui pesait 365 M$ en bourse, est insolvable. Elle disparaît en quelques mois.
