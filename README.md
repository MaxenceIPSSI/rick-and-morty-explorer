# 🛸 Rick & Morty Explorer

SPA Angular qui explore trois ressources liées de l'API [Rick & Morty](https://rickandmortyapi.com) :
**personnages**, **lieux** et **épisodes**. Recherche temps réel, pagination, favoris persistants,
tableau de bord statistique, formulaire de contact réactif et bonus **GraphQL**.

---

## 🚀 Lancer le projet

```bash
npm install
npm start
```

L'application est servie sur `http://localhost:4200`.

Build de production :

```bash
npm run build
```

---

## ✅ Fonctionnalités réalisées

### Bloc A — Modèles & Services
- [x] 5 modèles : `Info`, `ApiResponse<T>`, `Character`, `Location`, `Episode`.
- [x] 5 services (`providedIn: 'root'`) : `CharacterService`, `LocationService`, `EpisodeService`, `FavorisService`, `StorageService`.
- [x] Réponses HTTP **typées** via les génériques, aucun appel HTTP dans un composant.
- [x] États **loading** et **erreur** gérés (`LoaderComponent` / `ErrorMessageComponent`).

### Bloc B — Pages & Navigation
- [x] 10 pages : dashboard, characters-list, character-detail, locations-list, location-detail, episodes-list, episode-detail, favoris, contact, not-found.
- [x] Routes avec `withComponentInputBinding()` + `input.required<string>()` dans les pages détail.
- [x] **Relations entre ressources** :
  - personnage → origine + lieu actuel (liens vers `locations/:id`) + épisodes (liens vers `episodes/:id`) ;
  - lieu → résidents (liens vers `characters/:id`) ;
  - épisode → personnages (liens vers `characters/:id`).
- [x] **Lazy loading** sur `favoris` et `contact`.
- [x] Page **404** sur `**`.

### Bloc C — Interactions
- [x] Recherche par nom : `debounceTime(300)` + `distinctUntilChanged()` + `switchMap()`.
- [x] Filtre par `status` (alive / dead / unknown).
- [x] Pagination *Précédent / Suivant* sur les 3 listes via `info.pages`.
- [x] Favoris ⭐ avec **persistance localStorage** (présents après rechargement).
- [x] Dashboard : totaux (`info.count`), nombre de favoris, répartition par statut — en `computed`.
- [x] Formulaire de contact réactif validé (`nom`, `email`, `message`), bouton désactivé si invalide, messages d'erreur + message de succès.

### Bloc D — Composants, pipes & qualité
- [x] 5 composants « dumb » : `CharacterCardComponent`, `SearchBarComponent`, `PaginatorComponent`, `LoaderComponent`, `ErrorMessageComponent`.
- [x] 2 pipes : `StatusPipe`, `TruncatePipe`.
- [x] `ChangeDetectionStrategy.OnPush` partout (composants dumb + pages).
- [x] Désabonnement propre via le **`pipe async`** uniquement (aucun `subscribe()` manuel).
- [x] **TypeScript strict**, **aucun `any`**.

### 🌟 Bonus — GraphQL
- [x] `apollo-angular` configuré (`provideApollo`, `InMemoryCache`, uri `https://rickandmortyapi.com/graphql`).
- [x] La liste des personnages peut être alimentée par une requête **GraphQL** `gql` avec variables (bouton **REST / GraphQL**).
- [x] La requête récupère le personnage **avec son lieu et ses épisodes en un seul appel**.

---

## 🏗️ Design patterns utilisés

| Pattern | Où | Pourquoi |
|---|---|---|
| **Singleton / Dependency Injection** | Services `providedIn: 'root'` | Une seule instance partagée, injectée via `inject()`. |
| **Smart / Dumb components** | Pages (smart) vs `components/` (dumb) | Sépare la logique métier de l'affichage réutilisable. |
| **Observer (RxJS)** | Recherche, listes, détails | Flux de données asynchrones composables. |
| **Reactive state (Signals)** | `FavorisService`, états de page | État réactif synchrone et `computed` dérivés. |
| **Facade / Service layer** | `CharacterService`, etc. | Encapsule l'accès HTTP, expose une API typée. |
| **Adapter** | `CharacterGraphqlService` | Convertit la réponse GraphQL vers le modèle `Character`. |

---

## ❓ Réponses aux questions

**1. Composant « smart » vs « dumb » ?**
Un composant *smart* connaît les services, déclenche les appels et gère l'état (ex : `CharactersListComponent`).
Un composant *dumb* ne reçoit que des `input()` et émet des `output()`, sans dépendance métier (ex : `CharacterCardComponent`,
qui reçoit un `Character` et émet `toggleFavori`). Cela isole la logique et rend l'UI réutilisable et testable.

**2. Pourquoi `OnPush` ? Lien avec l'immutabilité ?**
`OnPush` ne relance la détection de changement que si une référence d'`input` change, si un évènement provient du composant,
ou si un signal/observable lu dans le template émet. C'est beaucoup plus performant. Cela suppose de travailler en **immutable** :
on remplace les objets/tableaux (`[...favoris, c]`) plutôt que de les muter, sinon la nouvelle référence n'est pas détectée.

**3. Pourquoi le `pipe async` plutôt qu'un `subscribe()` manuel ?**
Le `pipe async` souscrit et **se désabonne automatiquement** quand le composant est détruit, et déclenche la détection
(`markForCheck`) compatible `OnPush`. Un `subscribe()` manuel non nettoyé provoque des **fuites mémoire** et des souscriptions
multiples ; le `pipe async` évite ce risque sans code de cycle de vie.

**4. `providedIn: 'root'` : quel design pattern ? Combien d'instances de `CharacterService` ?**
C'est le pattern **Singleton** via l'injecteur racine. Il existe **une seule** instance de `CharacterService` pour toute
l'application, partagée par tous les composants qui l'injectent (et *tree-shakable* si jamais inutilisée).

**5. `signal` vs `BehaviorSubject` ? Pourquoi un `signal` pour les favoris ?**
Un `signal` est une valeur réactive **synchrone**, lue directement (`favoris()`), sans souscription, et intégrée à la détection
de changement ; un `BehaviorSubject` est un flux asynchrone qu'il faut souscrire et désabonner. Pour les favoris, l'état est
local et synchrone, et `computed` (`nombre`, répartition) en découle naturellement : le `signal` est plus simple et plus sûr.

**6. Pourquoi `switchMap` (et pas `mergeMap`) ? À quoi sert `debounceTime` ?**
`switchMap` **annule la requête précédente** dès qu'un nouveau terme arrive : on ne garde que le résultat de la dernière
recherche, évitant les réponses obsolètes (race conditions). `mergeMap` les laisserait toutes vivre en parallèle.
`debounceTime(300)` attend une pause de 300 ms dans la frappe avant d'émettre, ce qui évite un appel HTTP à chaque touche.

**7. Reactive Forms vs Template-driven ?**
Les *Reactive Forms* décrivent le formulaire en TypeScript (`FormGroup`, `Validators`), ce qui les rend explicites, fortement
typés, testables et adaptés aux validations complexes. Le projet l'impose car la validation (longueurs, email, état du bouton,
messages) est plus claire et maîtrisée côté composant qu'avec le *template-driven*.

**8. Comment récupérer les relations à partir des URLs ?**
Les champs `episode`, `residents`, `characters` sont des tableaux d'**URLs**. On extrait l'`id` final
(`url.split('/').pop()`, via `idsFromUrls`) puis on appelle `getMany(ids)` qui interroge `/api/.../1,2,3` en **un seul appel**.
L'API renvoie un objet seul pour un id unique, normalisé via `ensureArray`.

**9. Qu'apporte le lazy loading des routes `favoris` et `contact` ?**
Leur code est mis dans un **chunk séparé** chargé seulement quand l'utilisateur visite la route. Le bundle initial est plus
léger → démarrage plus rapide. On le voit dans le build (`chunk … contact`, `chunk … favoris`).

**10. (Bonus) GraphQL vs REST ?**
En REST, charger un personnage avec son lieu et ses épisodes demande plusieurs requêtes (1 personnage + 1 lieu + N épisodes →
*under-fetching*). En GraphQL, une seule requête déclare exactement les champs liés voulus et les renvoie ensemble :

```graphql
query ($page: Int, $name: String) {
  characters(page: $page, filter: { name: $name }) {
    info { count pages next prev }
    results { id name status image location { id name } episode { id name } }
  }
}
```

---

## 📸 Captures d'écran

Voir le dossier [`screenshots/`](./screenshots/).

---

## 🗂️ Structure

```
src/app/
├── pages/        dashboard, characters-list, character-detail, locations-list,
│                 location-detail, episodes-list, episode-detail, favoris, contact, not-found
├── components/   character-card, search-bar, paginator, loader, error-message
├── services/     character, location, episode, favoris, storage, character-graphql
├── models/       character, location, episode, info, api-response
├── pipes/        status, truncate
├── graphql/      requête gql des personnages
├── shared/       utilitaires (extraction d'id, remote-data)
├── app.routes.ts
└── app.config.ts
```
