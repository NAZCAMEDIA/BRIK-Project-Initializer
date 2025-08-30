# Guía de contribución

Gracias por tu interés en mejorar el proyecto. Para mantener la calidad del código sigue estas recomendaciones:

## Ramas
- La rama principal es `main`.
- Crea ramas de trabajo a partir de `main` usando el formato `feature/nombre-descriptivo` o `fix/nombre-descriptivo`.

## Convención de commits
- Utiliza [Conventional Commits](https://www.conventionalcommits.org/) en inglés.
- Ejemplos: `feat: add nueva plantilla`, `fix: corregir validación`.

## Requisitos de pruebas
Antes de enviar un pull request ejecuta localmente:

```bash
npm test
npm run lint
npm run typecheck
```

Asegúrate de que todos los comandos finalicen sin errores.
