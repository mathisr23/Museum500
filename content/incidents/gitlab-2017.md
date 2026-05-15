---
title: "GitLab — Le rm -rf de 6 heures"
shortName: "GitLab"
date: "2017-01-31"
category: "operational"
tagline: "Un ingénieur épuisé, une session SSH ouverte sur la mauvaise machine, et 5 sauvegardes qui ne fonctionnaient pas."
damages:
  duration: "6 heures avec perte de données"
  impact: "300 GB de données utilisateur perdus, 5037 projets affectés"
  cost: "6 heures de travail perdues pour des milliers d'utilisateurs"
postMortemUrl: "https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/"
culpritCode:
  language: "shell"
  snippet: "# Tentative de sync DB de prod vers secondary\n$ sudo rm -rf /var/opt/gitlab/postgresql/data\n# ...wrong terminal."
  annotation: "L'ingénieur pensait être sur le secondaire. Il était sur le primaire de production."
timeline:
  - time: "21:00 UTC"
    event: "Pic de charge. Spam massif détecté. Réplication DB en retard."
  - time: "22:00 UTC"
    event: "Tentative manuelle de réinitialiser la réplication. L'ingénieur, après plusieurs heures de debug, ouvre deux terminals pour les deux machines."
  - time: "23:00 UTC"
    event: "Sur la mauvaise fenêtre, il lance rm -rf sur le data dir. Réalise son erreur en 1-2 secondes. 300 GB déjà supprimés."
  - time: "T+1h"
    event: "Découverte : 5 mécanismes de backup sur 5 sont défaillants ou pointent dans le vide."
  - time: "T+6h"
    event: "Restoration depuis un snapshot LVM de staging vieux de 6 heures. Tout ce qui a été créé entre temps est perdu."
testimonies:
  - source: "GitLab Post-Mortem"
    quote: "Sur les 5 mécanismes de sauvegarde déployés, aucun ne fonctionnait correctement. Soit ils étaient configurés mais cassés, soit ils n'étaient jamais exécutés."
    url: "https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/"
lessons:
  - title: "Un backup non-testé n'est pas un backup."
    body: "Cinq systèmes en parallèle, zéro restauration testée. La règle 3-2-1 ne suffit pas — il faut restaurer régulièrement."
  - title: "Les humains fatigués font des erreurs."
    body: "Travailler à 23h sur de la prod après une journée pleine est un anti-pattern. La fatigue cognitive est la cause racine derrière la cause apparente."
  - title: "Le post-mortem public construit la confiance."
    body: "GitLab a livestreamé sa restauration sur YouTube. Réaction tech : respect. C'est devenu un exemple de transparence."
---

Le 31 janvier 2017, vers 23h UTC, un ingénieur GitLab tente de réparer une réplication PostgreSQL qui décroche. Pour ça, il faut wiper le secondaire et le re-synchroniser depuis le primaire.

Il a deux terminals ouverts : un sur le secondaire (db2), un sur le primaire (db1). Il bascule entre les deux pour exécuter les bonnes commandes au bon endroit.

À 23h27, il tape `sudo rm -rf /var/opt/gitlab/postgresql/data`.

Sur le mauvais terminal.

Il réalise son erreur en quelques secondes et coupe la commande. Trop tard : 300 Go de données primaires viennent d'être effacées. Il appelle l'équipe SRE en panique.

Et là, pire : aucune des cinq stratégies de backup ne fonctionne réellement. Le seul artefact récupérable est un snapshot LVM de staging vieux de 6 heures, qu'on utilise pour restaurer la prod. Tout ce qui a été créé entre 17h30 et 23h27 est perdu.

GitLab livestream l'incident en direct sur YouTube. C'est devenu un cas d'école de transparence post-mortem.
