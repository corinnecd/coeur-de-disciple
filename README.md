# Cœur de Disciple

Application Next.js destinée à accompagner la méditation personnelle, les parcours de croissance et la vie en groupe.

## Premier lot

- page d’accueil et espace « Aujourd’hui » responsive ;
- authentification Neon Auth par Google ou e-mail/mot de passe ;
- vérification de l’adresse e-mail par code ;
- protection des routes privées ;
- création ou jonction d’un groupe pendant l’onboarding ;
- page profil avec déconnexion ;
- schéma PostgreSQL initial et migration Drizzle pour les profils, groupes, parcours, méditations, progression, notes, annonces et journal d’audit.

## Installation locale

Prérequis : Node.js 20 ou supérieur et un projet Neon configuré avec Neon Auth.

```bash
npm install
cp .env.example .env.local
npm run dev -- --hostname 127.0.0.1
```

L’application est ensuite disponible sur [http://localhost:3000](http://localhost:3000).

Variables nécessaires :

```env
NEON_AUTH_BASE_URL=https://your-endpoint.neonauth.region.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=replace-with-a-random-secret-of-at-least-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

`DATABASE_URL` est nécessaire pour générer ou appliquer les migrations, mais pas pour afficher les pages publiques ni pour utiliser Neon Auth.

## Commandes

```bash
npm run lint          # contrôle ESLint
npm run build         # compilation de production
npm run db:generate   # génère une migration Drizzle
npm run db:migrate    # applique les migrations
npm run db:studio     # ouvre Drizzle Studio
```

## Structure utile

- `src/app/connexion` : connexion, inscription et vérification e-mail ;
- `src/app/onboarding` : configuration initiale et groupe ;
- `src/app/aujourdhui` : tableau de bord authentifié ;
- `src/app/profil` : informations personnelles et déconnexion ;
- `src/db/schema.ts` : schéma applicatif PostgreSQL ;
- `drizzle/` : migrations SQL versionnées ;
- `proxy.ts` : protection des routes privées par Neon Auth.

## Sécurité

Les secrets restent dans `.env.local`, qui est ignoré par Git. Le Data API Neon ne doit pas recevoir d’accès public sur le schéma avant la mise en place des politiques RLS. Les notes privées ne seront exposées qu’à leur propriétaire dans le lot de données suivant.
