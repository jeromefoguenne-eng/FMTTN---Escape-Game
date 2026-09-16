# Guide de Restauration de l'Ancienne Version (Pré-Investigation)

Cette archive conserve l'exacte version précédente du jeu (version sauvetage spatial classique avec bande sonore en Ré mineur progressive).

## Méthode 1 : Restauration immédiate en local via les fichiers sauvegardés
Un dossier complet de sauvegarde existe dans :
`codescape-fmttn/backup_pre_investigation/src`

Pour restaurer :
```bash
# Copier le contenu du dossier de sauvegarde
cp -r backup_pre_investigation/src/* src/
npm run build
```

## Méthode 2 : Restauration via la branche Git dédiée
Une branche Git de sauvegarde permanente a été créée et poussée sur votre dépôt GitHub :
- **Branche** : `backup-version-sauvetage-standard`
- **Tag** : `v1.0-version-classique`
- **Lien GitHub** : https://github.com/jeromefoguenne-eng/FMTTN---Escape-Game/tree/backup-version-sauvetage-standard

Pour revenir à cette version sur votre branche de travail :
```bash
git checkout backup-version-sauvetage-standard
```
