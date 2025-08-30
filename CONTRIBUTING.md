# Guía de Contribución / Contributing Guide

Este documento describe cómo colaborar con el proyecto. Está disponible en español e inglés.

## 🇪🇸 Guía en Español

### Flujo de Ramas
- `main`: código estable listo para producción.
- `develop`: rama de integración principal.
- `feature/<nombre>`: nuevas funcionalidades.
- `fix/<nombre>`: correcciones y hotfixes.

### Convención de Mensajes
Sigue [Conventional Commits](https://www.conventionalcommits.org/): `tipo(alcance?): descripción` en presente.
Ejemplos: `feat(api): agrega endpoint`, `fix(ui): corrige estilo`, `docs: actualiza guía`.

### Cobertura Mínima
Los cambios deben mantener **al menos 80%** de cobertura de pruebas unitarias.
Ejecuta `npm test -- --coverage` y adjunta el reporte en el Pull Request.

## 🇬🇧 English Guide

### Branch Workflow
- `main`: stable, production-ready code.
- `develop`: main integration branch.
- `feature/<name>`: new features.
- `fix/<name>`: bug fixes and hotfixes.

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope?): description` in the present tense.
Examples: `feat(api): add endpoint`, `fix(ui): adjust style`, `docs: update guide`.

### Coverage Requirement
Changes must keep unit test coverage **at least 80%**.
Run `npm test -- --coverage` and include the report in the Pull Request.
