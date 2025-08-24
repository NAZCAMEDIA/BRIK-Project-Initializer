# 🧬 BRIK Project Initializer

[![Rust](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-rust.yml/badge.svg)](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-rust.yml)
[![TypeScript](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-ts.yml/badge.svg)](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-ts.yml)
[![Python](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-py.yml/badge.svg)](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-py.yml)
[![Docs](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-docs.yml/badge.svg)](https://github.com/C-BIAS/BRIK-Project-Initializer/actions/workflows/brik-docs.yml)

Inicializador universal para crear proyectos con filosofía DAAF‑BRIK‑Circuitalidad Digital: core inmutable, wrappers evolutivos, documentación viviente, auditoría transversal y gestión termodinámica de entropía.

---

## 📌 Objetivos

- Estandarizar la creación de proyectos con estructura BRIK.
- Generar ADN del proyecto y manifiesto de circuitalidad.
- Proveer documentación obligatoria y su validador automático.
- Facilitar configuraciones base por tipo de proyecto (p.ej. Rust).

---

## 🧠 Filosofía (DAAF‑BRIK‑Circuitalidad Digital)

- Core inmutable (post‑deployment) con 100% de cobertura en el núcleo.
- Wrappers evolutivos alrededor del core para extender capacidades sin romper invariantes.
- Living Code Layer: consciencia y diagnósticos embebidos.
- Termodinámica Digital: monitoreo de “entropía” para estados ACTIVE/DORMANT/HIBERNATING.
- Auditoría y trazabilidad integral de decisiones y cambios.

Referencias locales:
- `CIRCUITALIDAD.md` (se genera en cada proyecto nuevo)
- `brik_implementation_guide.md`
- `brikseed/docs/*` (manifiestos, glosario y marco fundacional)

---

## ✅ Qué hace este inicializador

- Crea la estructura de carpetas BRIK estándar: `core/`, `components/`, `living-layer/`, `audit/`, `tests/`, `benchmarks/`, `scripts/`, `config/`, `docs/…`.
- Genera el ADN del proyecto: `.brik-dna.yml` con principios y cumplimiento.
- Genera el Manifiesto: `CIRCUITALIDAD.md` con compromisos y estados.
- Crea documentación de producto con plantillas: PRD, historias, flujos.
- Instala configuración base según tipo de proyecto (hoy Rust funcional; otros tipos como TypeScript/Python/Go están preparados como placeholders para extender).
- Crea un validador de documentación: `scripts/validate-docs.sh` (revisa el checklist y calcula porcentaje de completitud; falla si < 85%).

---

## 📦 Requisitos

- Bash 4+, `git`.
- macOS o Linux.
- Recomendado: `node` y `docker` (opcionales según tu stack).
- Para Rust: `rustup`/`cargo` si eliges tipo `rust`.

Nota macOS: el script usa `sha256sum`. En macOS instala coreutils (`brew install coreutils`) o adapta a `shasum -a 256` si fuese necesario.

---

## 🚀 Inicio Rápido

1) Clona este repo y entra en él

```
git clone <tu-fork-o-repo> BRIK-Project-Initializer
cd BRIK-Project-Initializer
```

2) Ejecuta el inicializador desde la raíz del repo

```
bash init-brik-project.sh <nombre_proyecto> <tipo>
# Ejemplos
bash init-brik-project.sh mi-proyecto rust
bash init-brik-project.sh mi-proyecto typescript
```

3) Sigue los pasos finales impresos por el script

- `cd <nombre_proyecto>`
- Revisa y completa `docs/DOCUMENTATION_CHECKLIST.md`.
- Ejecuta `./scripts/validate-docs.sh` hasta lograr ≥ 85% (dev), ideal ≥ 95%, perfecto 100%.
- Instala dependencias según el tipo de proyecto.

---

## 🧪 Ejemplos

### 1) Crear proyecto Rust y validar documentación

```
bash init-brik-project.sh demo-brik rust
cd demo-brik
./scripts/validate-docs.sh
```

Salida típica inicial (resumen):

```
📚 BRIK Documentation Validator
═══════════════════════════════
📊 Estado de Documentación:
   Total items: 80
   Completados: 0
   Pendientes: 80
   Completitud: 0%

❌ FALLO: Completitud insuficiente (0%)
   Mínimo requerido: 85% para desarrollo

📋 Items Pendientes:
   12: - [ ] Documento de Requisitos de Producto (PRD)
   ...
```

Para la demo, marca el checklist como completado (solo con fines de validación del flujo):

```
sed -i 's/\- \[ \]/- [x]/g' docs/DOCUMENTATION_CHECKLIST.md
./scripts/validate-docs.sh
```

Salida esperada tras completar:

```
📚 BRIK Documentation Validator
📊 Estado de Documentación:
   Completitud: 100%
🎉 PERFECTO: Documentación 100% completa
   ✅ Certificación BRIK: APROBADA
```

Validar cobertura 100% global (Rust; requiere `cargo-tarpaulin` instalado):

```
./scripts/test-coverage.sh
```

Si la cobertura es <100%, el script saldrá con error y mensaje indicando el porcentaje.

### 3) Crear proyecto TypeScript y validar cobertura

```
bash init-brik-project.sh demo-ts typescript
cd demo-ts
# Instala dependencias (una sola vez)
npm install
# Ejecuta cobertura con umbral 100%
./scripts/test-coverage.sh
```

### 4) Crear proyecto Python y validar cobertura

```
bash init-brik-project.sh demo-py python
cd demo-py
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
./scripts/test-coverage.sh
```

### 2) Crear proyecto TypeScript (placeholder actual)

```
cd ..
bash init-brik-project.sh demo-ts typescript
cd demo-ts
./scripts/validate-docs.sh # funciona igual para documentación
```

---

## 🗂️ Estructura generada (resumen)

```
<nombre_proyecto>/
├── .brik-dna.yml
├── CIRCUITALIDAD.md
├── README.md
├── core/
├── components/
├── living-layer/
├── audit/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── property/
│   └── immutability/
├── benchmarks/
├── scripts/
│   └── validate-docs.sh
├── config/
└── docs/
    ├── product/
    │   ├── PRD.md
    │   ├── user-stories.md
    │   └── user-flows.md
    ├── technical/
    ├── operational/
    └── optional/
```

---

## 🧬 Archivos clave

- `.brik-dna.yml`: ADN del proyecto con principios, cumplimiento y metadatos.
- `CIRCUITALIDAD.md`: manifiesto con compromisos y estados termodinámicos.
- `docs/DOCUMENTATION_CHECKLIST.md`: checklist obligatorio (copiado desde `templates/`).
- `scripts/validate-docs.sh`: validador de completitud documental.

---

## 🛠️ Uso del validador de documentación

```
./scripts/validate-docs.sh
```

- Mide items totales vs completados del checklist.
- Estados: falla si < 85% (bloquea CI/CD recomendado); advierte si < 95% (target producción); celebra 100% (certificación BRIK).
- Muestra los primeros items pendientes para acelerar el trabajo.

---

## ⚙️ Tipos de proyecto

- `rust` (implementado):
  - Genera `Cargo.toml`, `src/main.rs` y estructura `src/{core,components,living-layer}`.
  - Dependencias base: `serde`, `tokio`.
- `typescript`, `python`, `go` (placeholders):
  - Estructura, docs y scripts se generan; falta completar generadores específicos (`generators/setup-<tipo>.sh`, `generate-technical-docs.sh`, etc.).

Puedes extenderlos siguiendo la sección “Extender y personalizar”.

---

## 🧪 Calidad y Cobertura (Requisito BRIK)

- 100% de tests pasando y 100% de cobertura GLOBAL y POR ARCHIVO.
- Cobertura completa: líneas, ramas, funciones y statements (cuando aplique).
- Durante desarrollo puedes usar umbrales menores, pero la certificación exige 100% total.
- Usa la carpeta `tests/` para unitarias, integración, property‑based e inmutabilidad.
- Integra el validador de docs en tu pipeline para garantizar auto‑consistencia.

Al cumplirse estas condiciones, el workflow genera un “sello BRIK”:
- Archivos: `.brik-cert.json` y `.brik-cert.sha256` (hash SHA‑256).
- Uso: sirve como huella verificable para seguimiento auditado (p.ej., integrar en una blockchain externa).

---

## 🔩 Scripts y generadores

Script principal:
- `init-brik-project.sh`: orquesta toda la inicialización.

Generadores (carpeta `generators/`):
- `generate-product-docs.sh`: crea PRD, historias y flujos.
- `generate-technical-docs.sh`: placeholder para docs técnicas.
- `generate-operational-docs.sh`: placeholder para docs operativas.
- `generate-optional-docs.sh`: placeholder para docs complementarias.
- `generate-core-templates.sh`: placeholder para templates de código base.
- `generate-scripts.sh`, `generate-dev-config.sh`: placeholders para automatización y config.
- `setup-rust.sh`: configuración específica para proyectos Rust.

---

## 🔌 Integración CI/CD (sugerida)

- Ejecuta el inicializador en un job temporal o usa un proyecto real y llama `./scripts/validate-docs.sh`.
- Haz que el pipeline falle si el validador retorna código distinto de 0.
- Añade jobs de cobertura y auditoría según tu stack.
- Cobertura 100% multi‑stack con Codecov (opcional para reportes históricos). Para repos privados, agrega `CODECOV_TOKEN` como secreto.
 

---

## 🧱 Extender y personalizar

1) Añadir soporte a un nuevo tipo (p.ej. Python):
- Crea `generators/setup-python.sh` para generar `pyproject.toml`/estructura y dependencias base.
- Actualiza `init-brik-project.sh` si deseas lógica adicional (o respeta el patrón `setup-<tipo>.sh`).

2) Completar generadores de documentación técnica/operativa:
- Edita `generators/generate-technical-docs.sh` y `generators/generate-operational-docs.sh` para crear archivos reales (p.ej. C4, ADRs, OpenAPI, ERD, guía de testing, CI/CD, etc.).

3) Añadir más validadores y scripts de calidad:
- `scripts/test-coverage.sh`, `scripts/audit-check.sh`, `scripts/entropy-monitor.sh` (hoy referenciados como próximos pasos; añádelos según tu stack).

---

## 🧯 Solución de problemas

- “Generadores no encontrados” al ejecutar: asegúrate de ejecutar desde la raíz del repo `BRIK-Project-Initializer`.
- Permisos: ejecuta con `bash init-brik-project.sh ...` (no requiere `chmod` previo, pero puedes hacerlo si lo deseas).
- `sha256sum` no existe (macOS): `brew install coreutils` o reemplaza por `shasum -a 256` en el script.
- `git` no instalado: instálalo e intenta nuevamente.
- Validador muestra 0 items: confirma que `docs/DOCUMENTATION_CHECKLIST.md` exista; se copia desde `templates/` durante la inicialización.

---

## 🧭 Roadmap sugerido

- Completar generadores técnicos/operativos con plantillas reales.
- Añadir soporte oficial para TypeScript/Python/Go.
- Scripts de cobertura, auditoría y entropía listos para CI.
- Plantillas de tests y benchmarks por tipo de proyecto.

---

## 🙌 Contribuir

- Revisa `brik_implementation_guide.md` para el marco conceptual.
- Propuestas: mejoras a generadores, nuevos tipos, ejemplos.
- Mantén la filosofía BRIK: documentación como código y core inmutable.

---

## 🔎 Glosario y referencias

- `brikseed/docs/BRIK_CORE_FRAMEWORK.md`
- `brikseed/docs/BRIK4.0_FUNDACIONAL.md`
- `brikseed/docs/DAAF_AI_v1.0.md`
- `brikseed/docs/Glosario DAAF AI v1.0.md`

---

Hecho con 🧬 y enfoque en Circuitalidad Digital.

Creado por: C-BIAS ENTREPRISES — https://www.c-bias.com

---

## 👤 Sobre C-BIAS ENTREPRISES

- Innovación y desarrollo de software con enfoque en calidad, auditoría y estandarización.
- Impulsa prácticas de ingeniería rigurosas: documentación viviente, pruebas exhaustivas y automatización.
- Colabora en ecosistemas multi‑stack (Rust, TypeScript, Python, Go), priorizando seguridad, performance y mantenibilidad.

[![Creado por C-BIAS ENTREPRISES](https://img.shields.io/badge/created_by-C--BIAS%20ENTREPRISES-0a66c2)](https://www.c-bias.com)
