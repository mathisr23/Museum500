// AUTO-GENERATED par scripts/build-content.mjs — ne pas éditer à la main.
// Source : /content/incidents/*.md

import type { Incident } from './incident.types';

export const INCIDENTS: Incident[] = [
  {
    "slug": "therac-25",
    "title": "Therac-25 — Le bug qui a tué",
    "shortName": "Therac-25",
    "date": "1985-06-03",
    "category": "ethical",
    "tagline": "Une race condition dans un appareil de radiothérapie. Six patients exposés à des doses létales.",
    "damages": {
      "duration": "1985–1987 (deux ans avant rappel)",
      "impact": "6 patients gravement brûlés, 3 décès directs",
      "cost": "Pertes humaines irréversibles"
    },
    "postMortemUrl": "https://web.archive.org/web/20211013015900/https://www.cs.umd.edu/class/spring2003/cmsc838p/Misc/therac.pdf",
    "culpritCode": {
      "language": "context",
      "snippet": "// Race condition (résumé)\n// Si l'opérateur saisit X, corrige rapidement en E,\n// puis valide avant que la commande X ait propagé,\n// la machine reste en mode haute énergie sans atténuateur.\nif (operatorEdit < 8s) { /* state inconsistant */ }",
      "annotation": "La machine fonctionnait sans atténuateur, délivrant ~100x la dose prévue."
    },
    "timeline": [
      {
        "time": "1982",
        "event": "Mise en service du Therac-25 — première machine 'logiciel only', sans verrous matériels."
      },
      {
        "time": "Juin 1985",
        "event": "Premier accident, Marietta. La patiente reçoit ~15 000 rads au lieu de 200. Décès quelques mois plus tard."
      },
      {
        "time": "1985-1986",
        "event": "Cinq autres accidents. Les opérateurs voient 'Malfunction 54' — un message générique non documenté."
      },
      {
        "time": "1986",
        "event": "Un physicien médical reproduit le bug — race condition entre saisie clavier et état de la machine."
      },
      {
        "time": "1987",
        "event": "Rappel par la FDA. AECL ajoute des verrous matériels que tous les compétiteurs avaient depuis 20 ans."
      }
    ],
    "testimonies": [
      {
        "source": "Nancy Leveson, MIT — étude de référence",
        "quote": "Le Therac-25 a abandonné les protections matérielles en faveur de protections logicielles. Mais le logiciel n'avait jamais été audité formellement.",
        "url": "https://web.archive.org/web/20211013015900/https://www.cs.umd.edu/class/spring2003/cmsc838p/Misc/therac.pdf"
      }
    ],
    "lessons": [
      {
        "title": "Le matériel doit pouvoir refuser le logiciel.",
        "body": "Quand la sûreté humaine est en jeu, un verrou physique non-bypassable n'est pas une option, c'est une obligation."
      },
      {
        "title": "Les messages d'erreur génériques tuent.",
        "body": "'Malfunction 54' était affiché 40 fois par jour. Les opérateurs avaient appris à le rebooter sans réfléchir."
      },
      {
        "title": "Le code testé sur une autre machine n'est pas testé.",
        "body": "Une partie du code venait du Therac-20, qui avait des verrous matériels masquant le bug. Le Therac-25 n'en avait plus."
      }
    ],
    "context": "Le Therac-25 est une machine de radiothérapie commercialisée par AECL (Atomic Energy of Canada Limited) à partir de 1982. Premier modèle de sa lignée à être *software-only* : les protections matérielles présentes sur les générations précédentes (Therac-6, Therac-20) sont supprimées au profit de vérifications logicielles, jugées suffisantes.\n\nEntre 1985 et 1987, six patients sont gravement irradiés. Trois en meurent.\n\nLa cause : une race condition dans la routine d'entrée des paramètres. Si l'opérateur saisit un mode haute énergie (X), réalise son erreur, corrige en mode faible énergie (E), puis valide en moins de 8 secondes — l'écran affiche bien E, mais l'atténuateur physique ne s'est pas déplacé. La machine délivre ~100 fois la dose prévue.\n\nLe message d'erreur affiché à l'opérateur : `Malfunction 54`. Cryptique, fréquent, jamais documenté. Les techniciens avaient appris à le rebooter par habitude.\n\nCe n'est qu'en 1986 que Fritz Hager, physicien médical à Tyler (Texas), reproduit le bug en chronométrant ses saisies. Le Therac-25 sera officiellement rappelé en 1987.\n\nC'est aujourd'hui une étude de cas obligatoire dans toutes les formations de génie logiciel critique."
  },
  {
    "slug": "knight-capital-2012",
    "title": "Knight Capital — 440 millions en 45 minutes",
    "shortName": "Knight Capital",
    "date": "2012-08-01",
    "category": "finance",
    "tagline": "Un flag oublié sur un seul des huit serveurs a fait couler une firme de Wall Street.",
    "damages": {
      "duration": "45 minutes",
      "impact": "4 millions de transactions erronées sur 154 actions",
      "cost": "440 M$ — faillite en 48h"
    },
    "postMortemUrl": "https://www.sec.gov/litigation/admin/2013/34-70694.pdf",
    "culpritCode": {
      "language": "context",
      "snippet": "// SMARS code path activé par le flag 'Power Peg'\n// Désactivé depuis 2003.\n// Code mort jamais supprimé.\nif (flagPowerPeg) { executeAggressiveBuyStrategy(); }",
      "annotation": "Le flag 'Power Peg' a été réutilisé en 2012 pour une autre fonction. Le déploiement n'a pas couvert les 8 serveurs."
    },
    "timeline": [
      {
        "time": "T-1 semaine",
        "event": "Knight déploie un nouveau code SMARS pour participer au programme RLP du NYSE."
      },
      {
        "time": "T-0",
        "event": "7 des 8 serveurs reçoivent le nouveau code. Le 8e est oublié."
      },
      {
        "time": "09:30 ET",
        "event": "Ouverture de marché. Le 8e serveur active 'Power Peg' — un code mort de 2003 — qui se met à acheter haut et vendre bas en boucle."
      },
      {
        "time": "09:35 ET",
        "event": "Volume anormal détecté. 4 millions de trades en 45 minutes."
      },
      {
        "time": "10:15 ET",
        "event": "Knight identifie la source et arrête le système."
      },
      {
        "time": "T+48h",
        "event": "Knight Capital sauvée par un consortium d'investisseurs. La firme disparaît dans Getco fin 2012."
      }
    ],
    "testimonies": [
      {
        "source": "SEC Order Cease and Desist",
        "quote": "Knight n'avait aucun système de contrôle automatique pour empêcher ce type d'erreur. Aucun rate-limit, aucun kill-switch.",
        "url": "https://www.sec.gov/litigation/admin/2013/34-70694.pdf"
      }
    ],
    "lessons": [
      {
        "title": "Le code mort tue.",
        "body": "Garder du code inutilisé pendant 9 ans 'au cas où' a coûté 440 M$. Supprimez."
      },
      {
        "title": "Le déploiement doit être atomique.",
        "body": "7/8 serveurs ne suffit pas. Les déploiements partiels doivent être détectés et bloqués."
      },
      {
        "title": "Réutiliser un flag est un piège.",
        "body": "Un flag déprécié ne devrait jamais retrouver une nouvelle sémantique. Renommez."
      }
    ],
    "context": "Le 1er août 2012, Knight Capital Group — l'un des principaux teneurs de marché du NYSE — déploie une mise à jour de son système de routage d'ordres SMARS pour participer au nouveau programme Retail Liquidity Program du NYSE.\n\nLe déploiement échoue silencieusement sur l'un des huit serveurs de production. Personne ne le remarque.\n\nÀ 9h30, l'ouverture de marché transforme ce serveur orphelin en machine à brûler de l'argent : il active un code de 2003, *Power Peg*, dont le rôle initial était de tester le système avec des trades volontairement non-rentables. En production, à pleine vitesse, sur de vraies actions.\n\nEn 45 minutes, Knight prend des positions massives sur 154 titres. Le marché bouge. À 10h15, quand l'équipe coupe le système, la perte est de 440 millions de dollars. La firme, qui pesait 365 M$ en bourse, est insolvable. Elle disparaît en quelques mois."
  },
  {
    "slug": "gitlab-2017",
    "title": "GitLab — Le rm -rf de 6 heures",
    "shortName": "GitLab",
    "date": "2017-01-31",
    "category": "operational",
    "tagline": "Un ingénieur épuisé, une session SSH ouverte sur la mauvaise machine, et 5 sauvegardes qui ne fonctionnaient pas.",
    "damages": {
      "duration": "6 heures avec perte de données",
      "impact": "300 GB de données utilisateur perdus, 5037 projets affectés",
      "cost": "6 heures de travail perdues pour des milliers d'utilisateurs"
    },
    "postMortemUrl": "https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/",
    "culpritCode": {
      "language": "shell",
      "snippet": "# Tentative de sync DB de prod vers secondary\n$ sudo rm -rf /var/opt/gitlab/postgresql/data\n# ...wrong terminal.",
      "annotation": "L'ingénieur pensait être sur le secondaire. Il était sur le primaire de production."
    },
    "timeline": [
      {
        "time": "21:00 UTC",
        "event": "Pic de charge. Spam massif détecté. Réplication DB en retard."
      },
      {
        "time": "22:00 UTC",
        "event": "Tentative manuelle de réinitialiser la réplication. L'ingénieur, après plusieurs heures de debug, ouvre deux terminals pour les deux machines."
      },
      {
        "time": "23:00 UTC",
        "event": "Sur la mauvaise fenêtre, il lance rm -rf sur le data dir. Réalise son erreur en 1-2 secondes. 300 GB déjà supprimés."
      },
      {
        "time": "T+1h",
        "event": "Découverte : 5 mécanismes de backup sur 5 sont défaillants ou pointent dans le vide."
      },
      {
        "time": "T+6h",
        "event": "Restoration depuis un snapshot LVM de staging vieux de 6 heures. Tout ce qui a été créé entre temps est perdu."
      }
    ],
    "testimonies": [
      {
        "source": "GitLab Post-Mortem",
        "quote": "Sur les 5 mécanismes de sauvegarde déployés, aucun ne fonctionnait correctement. Soit ils étaient configurés mais cassés, soit ils n'étaient jamais exécutés.",
        "url": "https://about.gitlab.com/blog/2017/02/01/gitlab-dot-com-database-incident/"
      }
    ],
    "lessons": [
      {
        "title": "Un backup non-testé n'est pas un backup.",
        "body": "Cinq systèmes en parallèle, zéro restauration testée. La règle 3-2-1 ne suffit pas — il faut restaurer régulièrement."
      },
      {
        "title": "Les humains fatigués font des erreurs.",
        "body": "Travailler à 23h sur de la prod après une journée pleine est un anti-pattern. La fatigue cognitive est la cause racine derrière la cause apparente."
      },
      {
        "title": "Le post-mortem public construit la confiance.",
        "body": "GitLab a livestreamé sa restauration sur YouTube. Réaction tech : respect. C'est devenu un exemple de transparence."
      }
    ],
    "context": "Le 31 janvier 2017, vers 23h UTC, un ingénieur GitLab tente de réparer une réplication PostgreSQL qui décroche. Pour ça, il faut wiper le secondaire et le re-synchroniser depuis le primaire.\n\nIl a deux terminals ouverts : un sur le secondaire (db2), un sur le primaire (db1). Il bascule entre les deux pour exécuter les bonnes commandes au bon endroit.\n\nÀ 23h27, il tape `sudo rm -rf /var/opt/gitlab/postgresql/data`.\n\nSur le mauvais terminal.\n\nIl réalise son erreur en quelques secondes et coupe la commande. Trop tard : 300 Go de données primaires viennent d'être effacées. Il appelle l'équipe SRE en panique.\n\nEt là, pire : aucune des cinq stratégies de backup ne fonctionne réellement. Le seul artefact récupérable est un snapshot LVM de staging vieux de 6 heures, qu'on utilise pour restaurer la prod. Tout ce qui a été créé entre 17h30 et 23h27 est perdu.\n\nGitLab livestream l'incident en direct sur YouTube. C'est devenu un cas d'école de transparence post-mortem."
  },
  {
    "slug": "cloudflare-2019",
    "title": "Cloudflare — La regex qui a éteint le web",
    "shortName": "Cloudflare",
    "date": "2019-07-02",
    "category": "technical",
    "tagline": "30 minutes d'effondrement global causées par 47 caractères.",
    "damages": {
      "duration": "30 minutes",
      "impact": "Trafic global Cloudflare en erreur 502",
      "cost": "Indisponibilité de millions de sites"
    },
    "postMortemUrl": "https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/",
    "culpritCode": {
      "language": "regex",
      "snippet": "(?:(?:\"|'|\\]|\\}|\\\\|\\d|(?:nan|infinity|true|false|null|undefined|symbol|math)|\\`|\\-|\\+)+[)]*;?((?:\\s|-|~|!|{}|\\|\\||\\+)*.*(?:.*=.*)))",
      "annotation": "Le `.*.*=.*` à la fin déclenche un backtracking catastrophique. Une seule ligne, déployée sur l'ensemble du réseau."
    },
    "timeline": [
      {
        "time": "13:42 UTC",
        "event": "Déploiement d'une nouvelle règle WAF visant à bloquer une famille d'attaques XSS."
      },
      {
        "time": "13:42 UTC",
        "event": "La regex consomme 100% des CPU sur tout le réseau Cloudflare en quelques secondes."
      },
      {
        "time": "13:45 UTC",
        "event": "Les sites derrière Cloudflare commencent à retourner du 502 Bad Gateway en masse."
      },
      {
        "time": "14:02 UTC",
        "event": "Mitigation globale : rollback de la règle WAF via le 'kill switch' déployé en urgence."
      },
      {
        "time": "14:09 UTC",
        "event": "Trafic rétabli. 27 minutes de panne mondiale."
      }
    ],
    "testimonies": [
      {
        "source": "John Graham-Cumming, CTO Cloudflare",
        "quote": "Cette regex avait un coût d'évaluation exponentiel. Sur du texte malformé, elle pouvait consommer des secondes de CPU par requête.",
        "url": "https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/"
      }
    ],
    "lessons": [
      {
        "title": "Toute regex en hot path doit être benchmarkée.",
        "body": "Une regex 're2-safe' (sans backtracking) ne pouvait pas exploser. Le moteur PCRE utilisé, oui."
      },
      {
        "title": "Le kill switch n'existe que si on l'a testé.",
        "body": "Cloudflare avait un kill switch — c'est ce qui les a sauvés. Sans ça, la panne durait des heures."
      },
      {
        "title": "Déploiement progressif, pas global.",
        "body": "La règle a été poussée partout en même temps. Un rollout par zone aurait limité la portée."
      }
    ],
    "context": "Le 2 juillet 2019, à 13h42 UTC, l'équipe sécurité de Cloudflare déploie une nouvelle règle WAF (Web Application Firewall) censée protéger contre une nouvelle classe d'injections XSS. La règle est une regex unique, écrite en PCRE.\n\nTrois minutes plus tard, le CPU de chaque serveur Cloudflare dans le monde sature à 100%. Le réseau qui sert ~10% du trafic web mondial commence à renvoyer des erreurs 502.\n\nLe coupable : un quantifieur catastrophique. Le motif `.*.*=.*` en fin d'expression force le moteur de regex à explorer un nombre exponentiel de combinaisons sur certains inputs. Ce qu'on appelle un *catastrophic backtracking*."
  },
  {
    "slug": "crowdstrike-2024",
    "title": "CrowdStrike — Le BSOD planétaire",
    "shortName": "CrowdStrike",
    "date": "2024-07-19",
    "category": "recent",
    "tagline": "8,5 millions de machines Windows en BSOD à cause d'un fichier de configuration vide.",
    "damages": {
      "duration": "Quelques heures à plusieurs jours selon les opérations",
      "impact": "8,5 M de machines Windows BSOD, vols cloués, hôpitaux, banques",
      "cost": "≈5 milliards de dollars d'impact estimé"
    },
    "postMortemUrl": "https://www.crowdstrike.com/blog/falcon-content-update-preliminary-post-incident-report/",
    "culpritCode": {
      "language": "context",
      "snippet": "// Channel File 291 — Falcon sensor\n// Buffer 21 'Template Type' devait être lu avec accès indexé.\n// Le fichier déployé contenait des octets nuls inattendus.\n// Driver kernel → out-of-bounds read → page fault → BSOD.",
      "annotation": "Le validator côté CrowdStrike avait un bug : il jugeait le fichier valide. Le driver kernel ne le tolérait pas."
    },
    "timeline": [
      {
        "time": "04:09 UTC",
        "event": "CrowdStrike pousse une mise à jour du Channel File 291 à tous les Falcon sensors actifs sous Windows."
      },
      {
        "time": "04:09–05:30 UTC",
        "event": "À chaque démarrage ou tentative de chargement du fichier, le driver kernel csagent.sys provoque un BSOD."
      },
      {
        "time": "05:30 UTC",
        "event": "Premiers signalements massifs. Les vols Delta, United, Frontier sont cloués au sol."
      },
      {
        "time": "05:48 UTC",
        "event": "CrowdStrike retire la mise à jour côté serveur. Mais les machines déjà infectées sont en BSOD-loop."
      },
      {
        "time": "06:00 UTC → 7 jours",
        "event": "Remédiation manuelle obligatoire : redémarrage en safe mode, suppression du fichier C-00000291*.sys. Sur des millions de machines."
      }
    ],
    "testimonies": [
      {
        "source": "CrowdStrike PIR (Preliminary Incident Report)",
        "quote": "Le validateur de Channel File a accepté un fichier qui aurait dû être rejeté. Les contrôles de cohérence n'étaient pas suffisants.",
        "url": "https://www.crowdstrike.com/blog/falcon-content-update-preliminary-post-incident-report/"
      }
    ],
    "lessons": [
      {
        "title": "Les drivers kernel doivent être paranoïaques.",
        "body": "Tout fichier de config externe doit être traité comme adversarial — bornes vérifiées, longueurs vérifiées, format vérifié."
      },
      {
        "title": "Le déploiement Big Bang est mort.",
        "body": "Pousser un binaire kernel à 8,5 M machines en 1h sans canari, c'est jouer à la roulette russe."
      },
      {
        "title": "La récupération est aussi importante que la prévention.",
        "body": "Le coût réel n'est pas le bug — c'est le fait qu'il fallait toucher physiquement chaque machine pour la remettre en route."
      }
    ],
    "context": "Le 19 juillet 2024 à 04h09 UTC, CrowdStrike — l'un des principaux EDR du marché — déploie une mise à jour de routine du Channel File 291, un fichier de configuration de son sensor Falcon. Aucun changement de code, juste une mise à jour de patterns.\n\nLe fichier livré contient des données malformées que le driver kernel `csagent.sys` ne sait pas gérer. À chaque tentative de chargement — c'est-à-dire à chaque boot — Windows part en *Blue Screen of Death*, en boucle.\n\n8,5 millions de machines Windows tombent. Delta Airlines annule 7 000 vols. Des hôpitaux reportent des opérations. Le NHS britannique déprogramme. Les banques ne peuvent plus traiter de transactions. Sky News ne peut plus diffuser.\n\nLe rollback côté serveur arrive en 90 minutes — mais c'est trop tard : les machines déjà touchées sont en BSOD-loop et ne peuvent plus rien recevoir. La remédiation est manuelle : safe mode, suppression du fichier, reboot. Multipliée par millions, sur des matériels parfois inaccessibles physiquement (laptops verrouillés par BitLocker dans des aéroports, ATMs dans des centres commerciaux).\n\nL'impact économique estimé dépasse les 5 milliards de dollars. C'est, à ce jour, la panne IT la plus chère de l'histoire."
  }
];
