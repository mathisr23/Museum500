# Museum of 500s

> Galerie scrollytelling Angular qui raconte l'histoire des 5 plus grands bugs prod de l'histoire du software.
> Chaque bug = une "salle" du musée avec timeline, témoignages, leçons.

**Statut au 2026-05-05 :** scaffold + motion layer 1 + motion layer 2 + motion layer 3 (final push) complets ✓. Build vert (6 routes prerendues, SEO complet inscrit dans le HTML statique). Pas de git init, pas encore deployé Vercel.

**Motion layer 3 livré (push max) :**
- **Sound design Web Audio** — clic terminal sur clic, hover tick subtil, drone ambiant (3 sinus détunés + filtre LFO). Default OFF, toggle bottom-right (`AudioToggleComponent`), persisté en localStorage.
- **Click splash** — chaque clic spawn `[CLICK 0xHEX]` rouge à la position du curseur, pop puis fade en 700ms. CSS pur + DOM via `FxService`.
- **SEO complet** — `SeoService` injecte Title/Meta/canonical/OG/Twitter/JSON-LD Article par route. Pré-rendu validé dans le HTML. Sitemap.xml + robots.txt + og-default.svg générés au build par `scripts/build-content.mjs`.
- **Kinetic 3D hero** — chaque ligne du H1 + tagline + meta layers en parallaxe 3D mouse-driven (`appParallaxHero` directive). Profondeurs négatives/positives pour effet de profondeur réelle.
- **Particle field** — caractères mono (codes HTTP, mots-clés bug) qui flottent en remontant dans le corridor, fade in/out, Canvas2D dpr-aware.

**Motion layer 1 livré :**
- Loader boot terminal (run once / session via `sessionStorage`)
- Glitch text component (RGB-split CSS pur) sur les H1
- GSAP ScrollTrigger : reveal staggered de chaque section incident, ligne timeline qui se dessine en scrub
- Scan lines CRT overlay global avec flicker
- Compteur d'erreurs animé en hero
- Sweep rouge sur les room cards au hover

**Motion layer 2 livré (push max) :**
- **Curseur scope/forensic** — remplacement du dot+halo générique. Crosshair full-viewport (2 lignes 1px) + label coordonnées `[ X / Y ]`. Au hover sur lien : crosshair vire rouge, label affiche `→ /musee/x` ou `↗ EXTERNAL`. Bonus : vert sur clic. Attribut `data-cursor="..."` sur les éléments pour custom labels.
- **Corridor 3D CSS** — couloir de musée en perspective pure CSS dans le hero (sol/plafond/murs en grille qui convergent vers point de fuite rouge pulsant). Parallaxe douce au mouvement souris. Mask radial pour fade dans les bords.
- **Page transitions** — overlay terminal entre routes (`$ GET /musee/x` → `→ 200 OK`), curtain qui s'ouvre en clip-path.
- **Scramble directive** (`appScramble`) — texte qui se "déchiffre" caractère par caractère à l'apparition (IntersectionObserver). Re-trigger au passage du curseur à proximité (<120px). Posé sur les headers, tagline, room shortNames.
- **Marquee** — bandeau bas de page avec codes HTTP / mots-clés bugs qui défilent en boucle.
**Owner :** Mathis (rivieremathis23@gmail.com) — profil front, déploie tout sur Vercel.

**Versions réelles à l'init :** Angular CLI 21.2.9, Node 22.13.0, npm 10.9.2. Le PROJECT.md disait "Angular 18+" — c'est en fait 21. Tailwind v3.4.x. Pas de `provideZonelessChangeDetection` (zone.js par défaut Angular 21).

---

## 1. Décisions arrêtées

| Question | Décision | Pourquoi |
|---|---|---|
| Stack | **Angular SSG 100% statique** | Profil front + tout sur Vercel. Pas de back. |
| Hébergement | **Vercel** | Vercel Services ne supporte pas Java/JVM. SSG = scale infini gratuit, parfait si viral. |
| Backend Java | **Abandonné pour ce projet** | 5 bugs figés = aucun back nécessaire. Over-engineering sinon. |
| Scope | **5 bugs très travaillés** | Mieux que 10 baclés. Le différenciant = profondeur du contenu. |
| Direction visuelle | **Awwwards-style expérimental** | Signature visuelle forte = condition pour partage viral. |
| Nom / slug | `museum-of-500s` | — |

---

## 2. Stack technique

- **Angular 18+** standalone components, signals
- **`@angular/ssr` en mode prerender (SSG)** — chaque salle = route prerendue au build
- **GSAP + ScrollTrigger** pour scrollytelling (pin, parallax, timeline)
- **Lenis** pour le smooth scroll
- **Three.js** léger pour le hub (plan du musée 3D)
- **Tailwind v3** (cohérent avec stack utilisateur — voir `ai-radar` gotcha sur Shadcn/Tailwind v4)
- **Markdown front-matter** dans `/content/incidents/*.md`, parsé au build via `gray-matter` + `marked` ou `ngx-markdown`
- **Deploy Vercel** : preset Angular, zéro config

---

## 3. Les 5 bugs (sélection validée)

Diversité voulue : technique pur / finance / opérationnel / éthique-vies humaines / récent.

1. **Cloudflare 2019** — regex catastrophique (`.*(?:.*=.*)`), 30 min internet down monde entier
2. **Knight Capital 2012** — vieux code laissé sur 1 serveur sur 8, 440 M$ perdus en 45 min, faillite
3. **GitLab 2017** — `rm -rf` en prod par fatigue, perte db 6h, post-mortem live-streamé
4. **Therac-25 1985-87** — race condition dans un appareil de radiothérapie, patients tués
5. **CrowdStrike juillet 2024** — driver kernel mal validé, 8.5 M machines BSOD, ~5 Md$ d'impact

---

## 4. Structure d'une salle (template)

Chaque incident = même 7 sections, scroll-driven :

1. **Antichambre** — date, dégâts chiffrés, durée (chiffres énormes, type tabulaire mono)
2. **Le décor** — contexte/stack/humain avant l'incident
3. **La timeline** — minute par minute, scroll-driven horizontal pin
4. **Le code coupable** — diff/snippet annoté, mise en évidence de la ligne tueuse
5. **Témoignages** — citations sourcées des post-mortems officiels (lien obligatoire)
6. **Les leçons** — 3-5 takeaways exploitables
7. **Sortie** — porte vers la salle suivante

---

## 5. Direction artistique (à itérer)

**Mood :** musée digital désaturé / glitch maîtrisé / monochrome + accent rouge HTTP 500.

- **Palette :** noir profond `#0a0a0a`, gris parchemin `#e8e6e1`, accent rouge `#ff2e2e`, vert terminal `#00ff88` (sparingly)
- **Typo :** display Editorial Old / Migra (free alt: Cormorant Garamond), mono JetBrains Mono pour code/logs, sans-serif Inter pour body
- **Hero :** compteur d'erreurs HTTP en temps réel (faux, animé) + invite à descendre dans le couloir 3D
- **Transitions de salle :** scroll horizontal pin + reveal progressif de la timeline
- **Sound design optionnel :** cliquetis terminal au scroll, alarme étouffée en hero

---

## 6. Roadmap

- [x] Init Angular 21 + SSG (`outputMode: 'static'`) + Tailwind v3
- [x] Setup Lenis service SSR-safe (GSAP wrappers à venir)
- [x] Pipeline content : MD front-matter → `incidents.generated.ts` (script `npm run content`, hook `prebuild`)
- [x] Layout général + routing (`/` et `/musee/:slug`)
- [x] Page hub `/` — plan du musée 5 salles + hero typo
- [x] Template salle `/musee/:slug` — 7 sections complètes
- [x] 5 contenus Markdown rédigés (V1, à enrichir avec sources réelles)
- [x] GSAP ScrollTrigger : reveal sections + scrub line timeline ✓
- [x] Polish visuel layer 1 : grain, scan lines, glitch, loader, compteur ✓
- [x] Polish visuel layer 2 : curseur forensic, corridor 3D CSS, page transitions, scramble, marquee ✓
- [x] Polish visuel layer 3 : sound design Web Audio, click splash, kinetic 3D parallax, particle field ✓
- [x] SEO complet : Title/Meta/OG/Twitter/JSON-LD prerendu, sitemap.xml, robots.txt, og-default.svg ✓
- [x] Hero images par salle : pipeline `sharp` raw→webp (800/1280/1920), composant `IncidentHeroComponent` plein-bleed 21:9 avec vignette/label/coins forensiques/parallax ✓
- [ ] **PROCHAIN BLOC** — `git init` + push GitHub + deploy Vercel + connect domaine custom
- [ ] OG image PNG par salle (option future — SVG global suffit pour le lancement)
- [ ] Sourcing rigoureux des post-mortems (vérifier chaque citation)
- [ ] Sourcing rigoureux : vérifier chaque citation avec source officielle (post-mortem URL)
- [ ] `git init` + push GitHub
- [ ] Deploy Vercel + domaine custom

---

## 7. Risques connus

- **Le contenu, pas le code** — 80% du temps ira sur le sourcing/rédaction des post-mortems. Citations vérifiées + liens vers les vrais post-mortems officiels OBLIGATOIRES (sinon perte de crédibilité tech).
- **Therac-25** — sujet sensible (vies humaines). Ton respectueux, factuel, pas sensationnaliste.
- **Performance Three.js** — garder le hub 3D ultra léger (~50k tris max), fallback 2D si mobile bas de gamme.
- **Angular SSG + Three.js** — Three.js n'aime pas le SSR ; wrap dans `afterNextRender()` ou check `isPlatformBrowser`.

---

## 8. Pour reprendre dans une nouvelle session

1. Ouvrir ce fichier en premier
2. `cd /c/AMOI/dev/museum-of-500s && npm run build` pour valider que ça build encore
3. `npm start` pour lancer le dev server
4. Continuer la roadmap §6 — prochain bloc = **GSAP ScrollTrigger** sur la timeline incident
5. Si conflit avec ce doc, **ce doc est la source de vérité** — mettre à jour si une décision change

## 9. Architecture du code (état actuel)

```
museum-of-500s/
├── content/incidents/             # 5 .md front-matter + body — source du contenu
├── scripts/build-content.mjs      # Pipeline MD → TS (run via `npm run content`)
├── src/
│   ├── app/
│   │   ├── data/
│   │   │   ├── incident.types.ts          # Types Incident, IncidentSummary, etc.
│   │   │   └── incidents.generated.ts     # ⚠️ AUTO-GÉNÉRÉ — ne pas éditer
│   │   ├── pages/
│   │   │   ├── home/                      # Plan du musée + hero
│   │   │   └── incident/                  # Template 7 sections
│   │   ├── services/
│   │   │   ├── incidents.service.ts       # bySlug, list, next
│   │   │   └── scroll.service.ts          # Lenis SSR-safe wrapper
│   │   ├── app.config.ts                  # provideRouter + withComponentInputBinding (route inputs)
│   │   ├── app.routes.ts                  # / et /musee/:slug
│   │   └── app.routes.server.ts           # getPrerenderParams pour les 5 slugs
│   ├── index.html                          # Google Fonts (Cormorant + Inter + JetBrains)
│   └── styles.css                          # Tailwind directives + grain SVG global
├── tailwind.config.js                     # Theme : ink/parchment/error/terminal
├── .postcssrc.json                         # Tailwind + autoprefixer
└── angular.json                            # outputMode: 'static' (SSG full)
```

**Hooks npm :**
- `npm run content` → exécute le pipeline MD
- `npm run prebuild` (auto avant `build`) → relance le content
- `npm run prestart` (auto avant `start`) → idem

**Liens utiles :**
- Vercel SSG Angular : https://vercel.com/docs/frameworks/angular
- GSAP ScrollTrigger : https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis : https://github.com/darkroomengineering/lenis
- Angular 21 prerender : https://angular.dev/guide/prerendering
