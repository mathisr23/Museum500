---
title: "Cloudflare — La regex qui a éteint le web"
shortName: "Cloudflare"
date: "2019-07-02"
category: "technical"
tagline: "30 minutes d'effondrement global causées par 47 caractères."
damages:
  duration: "30 minutes"
  impact: "Trafic global Cloudflare en erreur 502"
  cost: "Indisponibilité de millions de sites"
postMortemUrl: "https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/"
culpritCode:
  language: "regex"
  snippet: "(?:(?:\"|'|\\]|\\}|\\\\|\\d|(?:nan|infinity|true|false|null|undefined|symbol|math)|\\`|\\-|\\+)+[)]*;?((?:\\s|-|~|!|{}|\\|\\||\\+)*.*(?:.*=.*)))"
  annotation: "Le `.*.*=.*` à la fin déclenche un backtracking catastrophique. Une seule ligne, déployée sur l'ensemble du réseau."
timeline:
  - time: "13:42 UTC"
    event: "Déploiement d'une nouvelle règle WAF visant à bloquer une famille d'attaques XSS."
  - time: "13:42 UTC"
    event: "La regex consomme 100% des CPU sur tout le réseau Cloudflare en quelques secondes."
  - time: "13:45 UTC"
    event: "Les sites derrière Cloudflare commencent à retourner du 502 Bad Gateway en masse."
  - time: "14:02 UTC"
    event: "Mitigation globale : rollback de la règle WAF via le 'kill switch' déployé en urgence."
  - time: "14:09 UTC"
    event: "Trafic rétabli. 27 minutes de panne mondiale."
testimonies:
  - source: "John Graham-Cumming, CTO Cloudflare"
    quote: "Cette regex avait un coût d'évaluation exponentiel. Sur du texte malformé, elle pouvait consommer des secondes de CPU par requête."
    url: "https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/"
lessons:
  - title: "Toute regex en hot path doit être benchmarkée."
    body: "Une regex 're2-safe' (sans backtracking) ne pouvait pas exploser. Le moteur PCRE utilisé, oui."
  - title: "Le kill switch n'existe que si on l'a testé."
    body: "Cloudflare avait un kill switch — c'est ce qui les a sauvés. Sans ça, la panne durait des heures."
  - title: "Déploiement progressif, pas global."
    body: "La règle a été poussée partout en même temps. Un rollout par zone aurait limité la portée."
---

Le 2 juillet 2019, à 13h42 UTC, l'équipe sécurité de Cloudflare déploie une nouvelle règle WAF (Web Application Firewall) censée protéger contre une nouvelle classe d'injections XSS. La règle est une regex unique, écrite en PCRE.

Trois minutes plus tard, le CPU de chaque serveur Cloudflare dans le monde sature à 100%. Le réseau qui sert ~10% du trafic web mondial commence à renvoyer des erreurs 502.

Le coupable : un quantifieur catastrophique. Le motif `.*.*=.*` en fin d'expression force le moteur de regex à explorer un nombre exponentiel de combinaisons sur certains inputs. Ce qu'on appelle un *catastrophic backtracking*.
