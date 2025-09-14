# 🚀 Instructions pour pousser HeadForge vers GitHub

## ✅ État actuel
- ✅ Code prêt et commité
- ✅ Packages store créés (Chrome, Firefox, Edge)
- ✅ GitHub Actions configuré
- ✅ Détecteur de mises à jour implémenté
- ✅ Plus de dossier `dist/` - utilise uniquement `store/`
- ✅ Tags Git créés (v1.0.0)

## 📋 Étapes pour créer le repository GitHub

### 1. Créer le repository sur GitHub
1. Aller sur : https://github.com/new
2. Nom du repository : `headforge`
3. Description : `Professional code header generator browser extension`
4. Le rendre **Public**
5. **NE PAS** cocher :
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Cliquer sur "Create repository"

### 2. Pousser le code
```bash
# Pousser le code
git push -u origin master

# Pousser les tags (déclenche GitHub Actions)
git push origin --tags
```

### 3. Vérifier GitHub Actions
1. Aller sur : https://github.com/satoshiba/headforge/actions
2. Vérifier que le workflow "Release" se lance
3. Attendre qu'il se termine (il va créer les packages et la release)

### 4. Vérifier la Release
1. Aller sur : https://github.com/satoshiba/headforge/releases
2. Vérifier que "HeadForge v1.0.0" est créé
3. Vérifier que les packages sont attachés :
   - `headforge-chrome.zip`
   - `headforge-firefox.zip`
   - `headforge-edge.zip`

## 🎉 Résultat attendu

Une fois poussé, votre extension pourra :
- ✅ Détecter automatiquement les mises à jour (toutes les 24h)
- ✅ Afficher un bouton discret "Check for updates"
- ✅ Montrer des notifications quand des mises à jour sont disponibles
- ✅ Ouvrir la page GitHub release quand cliqué

## 🔧 Dépannage

### Si le push échoue :
1. Vérifier que le repository existe sur GitHub
2. Vérifier l'URL du remote : `git remote -v`
3. Vérifier les permissions de push

### Si GitHub Actions échoue :
1. Vérifier l'onglet "Actions" sur GitHub
2. Vérifier que tous les fichiers requis sont présents
3. Vérifier la syntaxe du workflow

### Si le détecteur de mises à jour ne fonctionne pas :
1. Vérifier l'URL du repository dans `src/utils/update-checker.ts`
2. Vérifier que les releases existent sur GitHub
3. Vérifier les permissions internet de l'extension

---

**Prêt à pousser ! 🚀**
