# 📋 Récap complet du projet MOURON & FILS

> Document mis à jour le 18 juin 2026  
> Point d'étape — workflow heures & rapports finalisés

---

## 🎯 Vue d'ensemble du projet

**Objectif** : Créer une application web/PWA de gestion BTP pour la SARL Mouron & Fils, accessible depuis tous les appareils (iPhone, Android, PC, Mac).

**Démarrage** : 25 avril 2026  
**État actuel** : **v0.5.0 alpha**, en ligne sur GitHub Pages, sécurisée (Auth + RLS par rôle), en phase de test interne

**URL** : https://v4l3nt1n09.github.io/mouron-fils-btp/

---

## 📅 Chronologie des sessions

| Date | Session | Étape clé |
|------|---------|-----------|
| 25 avril 2026 | Démarrage | Première maquette HTML/CSS/JS |
| 6 mai 2026 (matin) | Modules + équipe | Équipe réelle 24 membres intégrée |
| 6 mai 2026 (soir) | Supabase | Connexion cloud (REST API native) |
| 11 mai 2026 | Polissage + Mac | MacBook reçu, polish UX |
| 12 mai 2026 | Déploiement | GitHub Pages activé, app en ligne |
| 14 mai 2026 | Devis Interfast | Suppression module Devis, intégration Interfast |
| 15 mai 2026 | Crédits | Page À propos + footer crédits |
| Mai–juin 2026 | **Sécurisation** | Auth Supabase + persistance de session + RLS réelle par rôle (fin des policies « Allow all ») |
| Mai–juin 2026 | **Heures dynamiques** | Migration vers `feuilles_heures`, chargement de l'équipe depuis la base |
| 12 juin 2026 | Validation pipeline heures | Vérification écriture/lecture des heures, identification des bugs prioritaires |
| 14 juin 2026 | **Système de rapports** | Réparation bout-en-bout + photos Supabase Storage + corrections de bugs |
| 18 juin 2026 | **Validation des heures (compta)** | Workflow de validation mensuelle + détail jour par jour + correctif messagerie |

---

## 🆕 Nouveautés majeures depuis la v0.1.0

### 🔐 Sécurité — Auth + RLS par rôle
- **Authentification Supabase** active (email / mot de passe) + **persistance de session** (reconnexion automatique).
- Le **JWT de l'utilisateur** est porté dans toutes les requêtes (lecture/écriture conformes à son rôle).
- **RLS réécrite** : fin des policies temporaires « Allow all », remplacées par de vraies règles par rôle sur chaque table.
- Fonctions SQL `SECURITY DEFINER` : `get_user_role()`, `get_user_initials()`, `is_user_admin()`.
- 🐞 **Bug critique corrigé** : `get_user_role()` lisait la mauvaise colonne (`role` au lieu de `role_key`), ce qui faisait échouer **silencieusement** la plupart des policies pour les non-admins.

### 📝 Système de rapports — réparé de bout en bout
- **Saisie** : symptômes, diagnostic, travaux effectués, commentaires technicien/client (tous correctement enregistrés).
- **Persistance** : chaque rapport finalisé est enregistré et réapparaît dans « Mes Rapports » après rechargement.
- **Consultation** en lecture seule : signatures redessinées, commentaires, heures, photos.
- **Photos réelles** → bucket **privé** Supabase Storage `rapport-photos`, affichées via **URL signées** temporaires (1 h).
- Règle métier : **1 rapport = 1 journée** ; le rapport du dernier jour (avec signature client) **clôt le chantier**.

### ⏱️ Heures — workflow de validation par la compta (façon Interfast)
- **Saisie d'une journée** : plages multiples, total, panier, lieu, statut brouillon / validé par le salarié.
- Liste **« À saisir » en continu** : tous les jours ouvrés non remplis du dernier mois (≈30 j).
- Onglet **Historique par mois** avec **3 états** : 🔘 À saisir · ⏳ En cours de validation · ✅ Validé.
- **Validation au niveau du mois** par la compta (nouvelle table `feuilles_validation`) :
  - vue compta (bouton 📋) → **détail jour par jour** (date, plages, total, statut, panier/lieu),
  - bouton **« Valider le mois »** → bascule en « Validé » côté compta **et** côté salarié,
  - bouton **« Signaler une erreur »** → ouvre une conversation pré-remplie avec le salarié concerné.
- 🔒 **Garantie RLS** : un salarié ne peut **pas** s'auto-confirmer un mois (INSERT réservé compta/gérant/admin).

### 📦 Supabase Storage
- Bucket **privé** `rapport-photos` (10 Mo max, images uniquement) + policies (lecture/écriture authentifiées).
- Accès aux fichiers via **URL signées** (jamais d'URL publique).

---

## ✅ Modules fonctionnels

### 🔐 Authentification
- Connexion Supabase Auth (email / mot de passe) + persistance de session
- 7 rôles distincts avec permissions différenciées (appliquées par la RLS)

### 👥 Gestion utilisateurs (Gérant)
- Tableau des membres + matrice visuelle des permissions par rôle
- Équipe chargée **dynamiquement** depuis Supabase (plus de liste en dur)

### 📅 Planning / Calendrier
- Vue Mois + Vue Semaine, couleur par STATUT
- Tabs : Aujourd'hui / En retard / À venir
- Les chantiers **terminés** sont masqués du planning

### 📋 Chantiers
- Cards client/ref/travaux/adresse/équipe/badge statut + panneau détail latéral (swipe back)
- 4 statuts : Planifié, En cours, Finition, Terminé
- Onglets fonctionnels **En cours / Retard / Terminés** (les terminés sont rangés à part)
- Filtres avancés, empty states, badge devis 🟢/🟡, création multi-dates

### ➕ Création d'intervention (Gérant/Chargé/Secrétaire)
- Client existant ou nouveau, référence auto (IN00100…)
- Type + description + PDF, photos (caméra/galerie), équipe multi-sélection
- 💰 Section Devis Interfast (N° + Date + Montant + PDF), calendrier multi-dates

### 👷 Mon Planning (Ouvrier/Chef/Dépanneur)
- Ouvrier : vue simple ; Chef/Dépanneur : + 🗺 GPS, 📞 Appel, 📝 Rapport, ⏱ Heures

### 📝 Rapports d'intervention (Chef/Dépanneur) — ✅ complet
- Symptômes / Diagnostic / Travaux + commentaires technicien & client
- Cerfa / PV réception / Attestation TVA 10%
- Photos (Supabase Storage), articles, heures par technicien
- **Signature technicien + client** (canvas tactile, Apple Pencil)
- Consultation en lecture seule fidèle (signatures, photos, commentaires)
- « J'ai terminé » → bascule auto du chantier en Terminé + confirmation

### ⏰ Feuilles d'heures (style Interfast) — ✅ workflow de validation
- Onglets Résumé (« à saisir ») / Historique (par mois, 3 états)
- Plages multiples, panier, lieu, brouillon / validé
- **Validation mensuelle par la compta** (voir Nouveautés majeures)

### 📊 Heures personnel (Comptable + Gérant) — ✅ contrôle & validation
- Vue d'ensemble par collaborateur (semaine / mois / contrat / heures supp.)
- 📋 **Détail jour par jour** d'un mois → contrôler, signaler une erreur, valider

### 👥 Équipes
- Fiches complètes + habilitations, filtres, modal détail, planning « Qui est où »
- Liens cliquables : téléphones (tel:), emails (mailto:), adresses (Plans/Maps)

### 💬 Messagerie hiérarchique
- 1à1 + groupes manuels + groupes par chantier
- Texte + Photos + PDF + Notes vocales, badge non-lus, bulles façon WhatsApp
- **100 % privée** : accès limité aux participants (aucun accès admin), garanti par la RLS
- 🐞 **Correctif** : la RLS attendait des types `'duo'/'groupe'` alors que l'app utilise `'1to1'/'group'/'chantier'` → la création de conversation était **bloquée pour tous les non-admins**

### 📎 Documents Interfast
- Page centralisée + stats (devis liés, total TTC, sans devis)
- Onglet Devis (+ Factures à venir), recherche, liste cliquable → chantier, « Ouvrir PDF »

### 💾 Sauvegarde
- Persistance localStorage + synchronisation Supabase (REST API native)
- Chargement robuste `safeGet` (une table en échec ne fait plus basculer l'app hors-ligne)
- Page de gestion (export, import, reset, stats), sauvegarde groupée (batch)

### ℹ️ À propos
- Hero coloré, cards équipe de dev (Valentin + Claude), stack, démarche, remerciements

---

## 👥 Équipe réelle intégrée (24 membres)

| Rôle | Membres | Initiales |
|------|---------|-----------|
| 👔 Gérant | Mickael Mouron | MM |
| 💼 Chargés d'affaires | Thomas, Guillaume, Thibaut | TH, GU, TB |
| 📊 Comptable | Déborah | DE |
| 📋 Secrétaires | Dianne, Annelise | DI, AN |
| 🦺 Chefs d'équipe | Damien, Cédric, **Valentin**, Océan, Alexis, Flavien, Jérémy | DA, CE, **VA**, OC, AL, FL, JE |
| 🛠 Dépanneurs | Tristan, Christophe, Romain G. | TR, CH, RG |
| 👷 Ouvriers | Mickael A., Florian, David, Romain L., Mickael S., Aurélie, Manolo | MA, FO, DV, RL, MS, AU, ML |

---

## 🎨 Améliorations UX réalisées

### Navigation
- 🔙 Bouton retour, 👈 swipe back (iOS), ☰ menu burger mobile, 📜 historique, ⌨️ Cmd+K

### Visuel
- ✨ Animations cards, 🍞 toasts redesignés, 🔘 rebond au tap, 🎭 empty states, ⏳ spinners
- 🖼️ Lightbox photo (pinch-zoom, pan, double-tap, boutons zoom)

### Fonctionnalités UX
- 🔍 Recherche globale, 🎛️ filtres avancés, 📞 liens cliquables, 📅 dates FR, ⚠️ confirmations, 🔄 pull-to-refresh
- 🧾 Export PDF d'un rapport (jsPDF, client-side)

### Mode sombre
- ❌ **Abandonné** (palette claire préférée pour le BTP en plein soleil)

---

## ☁️ Infrastructure technique

### Stack
- **Frontend** : HTML / CSS / JavaScript (vanilla), fichier unique `index.html`
- **Base de données** : Supabase (PostgreSQL + REST API)
- **Stockage fichiers** : Supabase Storage (bucket privé + URL signées)
- **Auth** : Supabase Auth (email / mot de passe) ✅ actif
- **Hébergement** : GitHub Pages (HTTPS)
- **Dev** : Mac + iPad (cible de compatibilité : iPad Safari)
- **PDF** : jsPDF (CDN, génération client-side)

### Supabase
- ✅ Projet actif (région Paris eu-west-3), plan Free
- ✅ **10 tables** : `team_members`, `clients`, `chantiers`, `events_cal`, `rapports`, `feuilles_heures`, `feuilles_validation`, `intervention_horaires`, `conversations`, `messages`
- ✅ **RLS réelle par rôle** sur toutes les tables (fin des policies « Allow all »)
- ✅ **Storage** : bucket privé `rapport-photos` (10 Mo, images) + policies authentifiées
- ✅ Connexion via fetch natif (`sbApi`) — SDK officiel abandonné (bugs iPad Safari)
- ℹ️ Table `invitations` **supprimée** (ancien mécanisme d'invitation)

### Git / GitHub
- ✅ Repo : V4l3nt1n09/mouron-fils-btp · README complet · PAT configuré · GitHub Pages actif
- Workflow : édition → upload via l'interface GitHub → sync (~1 min) → test (Cmd+Shift+R)

---

## 🎯 Décisions stratégiques importantes

### ✅ Maintenues
- Stack **HTML/CSS/JS vanilla** (apprentissage progressif)
- **Supabase** pour base + auth + stockage
- **Co-crédit** Valentin + Claude (Anthropic)
- **Messagerie 100 % privée** : aucun accès admin aux conversations (décision définitive)
- **Logo original** conservé (toute refonte abandonnée — décision du gérant)

### ❌ Abandonnées
- Module Devis complet (normes BTP → on garde Interfast)
- Mode sombre · Migration Next.js · SDK Supabase officiel

### 🔄 En discussion
- API Interfast (après stabilisation) · Auto-hébergement Supabase (6–12 mois)
- Accès en écriture à Notion (à traiter dans une session dédiée)

---

## 🚧 Ce qui reste à faire

### 🟠 Priorité MOYENNE
- 📦 **Centraliser les photos sur Storage** :
  - brancher les photos **d'interventions** ;
  - créer un **bucket séparé et privé** pour les photos de **messages** (accès limité aux participants) — *ne pas* réutiliser `rapport-photos` (confidentialité de la messagerie).
- 🐞 **Bug latent `saveInvitation`** : vise encore la table `invitations` supprimée (cassera à l'ajout d'un vrai membre).
- 📱 **PWA installable** (manifeste + icônes + service worker).
- 🧹 Finitions **Phase 5** : email réel de Thomas Vialens, suppression des derniers tableaux en dur.

### 🟢 Priorité BASSE
- 🗜️ Compression des photos avant upload (pour la 4G)
- 🔔 Notifications (temps réel / push / email)
- 📊 Tableau de bord enrichi · 💰 Module Factures · 🌐 API Interfast

---

## 📊 Stats du projet

- **Lignes de code** : ~9 000
- **Modules fonctionnels** : 16+
- **Rôles utilisateurs** : 7
- **Membres équipe** : 24
- **Tables Supabase** : 10
- **Sessions de développement** : ~12

---

## 🏆 Réussites notables

- ✅ App **fonctionnelle de bout en bout** et **sécurisée** (Auth + RLS par rôle)
- ✅ **Système de rapports** complet (saisie → consultation → photos cloud)
- ✅ **Workflow de validation des heures** par la compta (contrôle → correction → validation)
- ✅ **Photos sur Supabase Storage** (bucket privé + URL signées)
- ✅ **Mickael a validé** le concept · **Cloud opérationnel** · **Déployée** sur GitHub Pages
- ✅ Plusieurs **bugs critiques** corrigés (RLS rôle, hors-ligne silencieux, messagerie)

---

## 💡 Points de vigilance pour la suite

1. **Phase de test** : élargir progressivement (Valentin + Mickael + compta + quelques-uns).
2. **Stockage** : surveiller la consommation Supabase (migrer le base64 restant vers Storage).
3. **Backup** : exporter régulièrement les données.
4. **Confidentialité messagerie** : maintenir le principe « zéro accès admin » dans toute évolution.
5. **Documentation** : continuer à noter chaque bug et idée pendant la phase test.

---

*Document mis à jour pour faire le point sur l'avancement.*  
*Co-développé par Valentin Mouron et Claude (Anthropic).*
