---
### Falla en CI/CD por detección de posibles secretos en templates

**Descripción**
El job de CI/CD falla al detectar patrones que podrían indicar la presencia de secretos en los archivos de templates, específicamente en:
- templates/typescript-fastify/src/api/users/gates/auth-gate.ts ([ref](https://github.com/NAZCAMEDIA/BRIK-Project-Initializer/blob/4ec4d61c1d38b3794a0e539701b94b5611939108/templates/typescript-fastify/src/api/users/gates/auth-gate.ts))

El script busca coincidencias como api_key, secret, password, token y termina el pipeline si encuentra resultados sospechosos.

**Pasos para resolver**
1. Revisar el archivo mencionado y asegurarse de que no existan valores de secretos hardcodeados.
2. Reemplazar cualquier valor real de secreto por una variable de entorno o por un placeholder tipo "change-in-production".
3. Validar que el template solo contenga referencias, nunca valores reales.
4. Ejecutar nuevamente el pipeline para verificar la resolución.

**Recomendaciones de código**
```typescript
// Antes (potencialmente inseguro):
const jwtSecret = "mi-super-secreto"; // NO HACER

// Después (seguro):
const jwtSecret = process.env.JWT_SECRET || "change-in-production";
```

**Criterios de éxito**
- El pipeline CI/CD debe pasar sin detenerse en el chequeo de secretos.
- El código fuente no debe contener valores reales de secretos en templates.

**Referencias**
- Log de error: [Job Run](https://github.com/NAZCAMEDIA/BRIK-Project-Initializer/actions/runs/17371089078/job/49310566689)
- Archivo involucrado: [auth-gate.ts (ref)](https://github.com/NAZCAMEDIA/BRIK-Project-Initializer/blob/4ec4d61c1d38b3794a0e539701b94b5611939108/templates/typescript-fastify/src/api/users/gates/auth-gate.ts)
---