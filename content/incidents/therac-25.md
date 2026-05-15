---
title: "Therac-25 — Le bug qui a tué"
shortName: "Therac-25"
date: "1985-06-03"
category: "ethical"
tagline: "Une race condition dans un appareil de radiothérapie. Six patients exposés à des doses létales."
damages:
  duration: "1985–1987 (deux ans avant rappel)"
  impact: "6 patients gravement brûlés, 3 décès directs"
  cost: "Pertes humaines irréversibles"
postMortemUrl: "https://web.archive.org/web/20211013015900/https://www.cs.umd.edu/class/spring2003/cmsc838p/Misc/therac.pdf"
culpritCode:
  language: "context"
  snippet: "// Race condition (résumé)\n// Si l'opérateur saisit X, corrige rapidement en E,\n// puis valide avant que la commande X ait propagé,\n// la machine reste en mode haute énergie sans atténuateur.\nif (operatorEdit < 8s) { /* state inconsistant */ }"
  annotation: "La machine fonctionnait sans atténuateur, délivrant ~100x la dose prévue."
timeline:
  - time: "1982"
    event: "Mise en service du Therac-25 — première machine 'logiciel only', sans verrous matériels."
  - time: "Juin 1985"
    event: "Premier accident, Marietta. La patiente reçoit ~15 000 rads au lieu de 200. Décès quelques mois plus tard."
  - time: "1985-1986"
    event: "Cinq autres accidents. Les opérateurs voient 'Malfunction 54' — un message générique non documenté."
  - time: "1986"
    event: "Un physicien médical reproduit le bug — race condition entre saisie clavier et état de la machine."
  - time: "1987"
    event: "Rappel par la FDA. AECL ajoute des verrous matériels que tous les compétiteurs avaient depuis 20 ans."
testimonies:
  - source: "Nancy Leveson, MIT — étude de référence"
    quote: "Le Therac-25 a abandonné les protections matérielles en faveur de protections logicielles. Mais le logiciel n'avait jamais été audité formellement."
    url: "https://web.archive.org/web/20211013015900/https://www.cs.umd.edu/class/spring2003/cmsc838p/Misc/therac.pdf"
lessons:
  - title: "Le matériel doit pouvoir refuser le logiciel."
    body: "Quand la sûreté humaine est en jeu, un verrou physique non-bypassable n'est pas une option, c'est une obligation."
  - title: "Les messages d'erreur génériques tuent."
    body: "'Malfunction 54' était affiché 40 fois par jour. Les opérateurs avaient appris à le rebooter sans réfléchir."
  - title: "Le code testé sur une autre machine n'est pas testé."
    body: "Une partie du code venait du Therac-20, qui avait des verrous matériels masquant le bug. Le Therac-25 n'en avait plus."
---

Le Therac-25 est une machine de radiothérapie commercialisée par AECL (Atomic Energy of Canada Limited) à partir de 1982. Premier modèle de sa lignée à être *software-only* : les protections matérielles présentes sur les générations précédentes (Therac-6, Therac-20) sont supprimées au profit de vérifications logicielles, jugées suffisantes.

Entre 1985 et 1987, six patients sont gravement irradiés. Trois en meurent.

La cause : une race condition dans la routine d'entrée des paramètres. Si l'opérateur saisit un mode haute énergie (X), réalise son erreur, corrige en mode faible énergie (E), puis valide en moins de 8 secondes — l'écran affiche bien E, mais l'atténuateur physique ne s'est pas déplacé. La machine délivre ~100 fois la dose prévue.

Le message d'erreur affiché à l'opérateur : `Malfunction 54`. Cryptique, fréquent, jamais documenté. Les techniciens avaient appris à le rebooter par habitude.

Ce n'est qu'en 1986 que Fritz Hager, physicien médical à Tyler (Texas), reproduit le bug en chronométrant ses saisies. Le Therac-25 sera officiellement rappelé en 1987.

C'est aujourd'hui une étude de cas obligatoire dans toutes les formations de génie logiciel critique.
