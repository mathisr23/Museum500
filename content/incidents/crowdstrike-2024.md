---
title: "CrowdStrike — Le BSOD planétaire"
shortName: "CrowdStrike"
date: "2024-07-19"
category: "recent"
tagline: "8,5 millions de machines Windows en BSOD à cause d'un fichier de configuration vide."
damages:
  duration: "Quelques heures à plusieurs jours selon les opérations"
  impact: "8,5 M de machines Windows BSOD, vols cloués, hôpitaux, banques"
  cost: "≈5 milliards de dollars d'impact estimé"
postMortemUrl: "https://www.crowdstrike.com/blog/falcon-content-update-preliminary-post-incident-report/"
culpritCode:
  language: "context"
  snippet: "// Channel File 291 — Falcon sensor\n// Buffer 21 'Template Type' devait être lu avec accès indexé.\n// Le fichier déployé contenait des octets nuls inattendus.\n// Driver kernel → out-of-bounds read → page fault → BSOD."
  annotation: "Le validator côté CrowdStrike avait un bug : il jugeait le fichier valide. Le driver kernel ne le tolérait pas."
timeline:
  - time: "04:09 UTC"
    event: "CrowdStrike pousse une mise à jour du Channel File 291 à tous les Falcon sensors actifs sous Windows."
  - time: "04:09–05:30 UTC"
    event: "À chaque démarrage ou tentative de chargement du fichier, le driver kernel csagent.sys provoque un BSOD."
  - time: "05:30 UTC"
    event: "Premiers signalements massifs. Les vols Delta, United, Frontier sont cloués au sol."
  - time: "05:48 UTC"
    event: "CrowdStrike retire la mise à jour côté serveur. Mais les machines déjà infectées sont en BSOD-loop."
  - time: "06:00 UTC → 7 jours"
    event: "Remédiation manuelle obligatoire : redémarrage en safe mode, suppression du fichier C-00000291*.sys. Sur des millions de machines."
testimonies:
  - source: "CrowdStrike PIR (Preliminary Incident Report)"
    quote: "Le validateur de Channel File a accepté un fichier qui aurait dû être rejeté. Les contrôles de cohérence n'étaient pas suffisants."
    url: "https://www.crowdstrike.com/blog/falcon-content-update-preliminary-post-incident-report/"
lessons:
  - title: "Les drivers kernel doivent être paranoïaques."
    body: "Tout fichier de config externe doit être traité comme adversarial — bornes vérifiées, longueurs vérifiées, format vérifié."
  - title: "Le déploiement Big Bang est mort."
    body: "Pousser un binaire kernel à 8,5 M machines en 1h sans canari, c'est jouer à la roulette russe."
  - title: "La récupération est aussi importante que la prévention."
    body: "Le coût réel n'est pas le bug — c'est le fait qu'il fallait toucher physiquement chaque machine pour la remettre en route."
---

Le 19 juillet 2024 à 04h09 UTC, CrowdStrike — l'un des principaux EDR du marché — déploie une mise à jour de routine du Channel File 291, un fichier de configuration de son sensor Falcon. Aucun changement de code, juste une mise à jour de patterns.

Le fichier livré contient des données malformées que le driver kernel `csagent.sys` ne sait pas gérer. À chaque tentative de chargement — c'est-à-dire à chaque boot — Windows part en *Blue Screen of Death*, en boucle.

8,5 millions de machines Windows tombent. Delta Airlines annule 7 000 vols. Des hôpitaux reportent des opérations. Le NHS britannique déprogramme. Les banques ne peuvent plus traiter de transactions. Sky News ne peut plus diffuser.

Le rollback côté serveur arrive en 90 minutes — mais c'est trop tard : les machines déjà touchées sont en BSOD-loop et ne peuvent plus rien recevoir. La remédiation est manuelle : safe mode, suppression du fichier, reboot. Multipliée par millions, sur des matériels parfois inaccessibles physiquement (laptops verrouillés par BitLocker dans des aéroports, ATMs dans des centres commerciaux).

L'impact économique estimé dépasse les 5 milliards de dollars. C'est, à ce jour, la panne IT la plus chère de l'histoire.
