### Falla CI/CD: detección de posibles secretos en templates

**Descripción:**
La pipeline de CI/CD falla debido a la detección de patrones sensibles (api_key, secret, password, token) en el archivo `templates/typescript-fastify/src/api/users/gates/auth-gate.ts` (ref 4ec4d61c1d38b3794a0e539701b94b5611939108).

**Pasos para resolver:**
1. Verificar que no existan valores de secretos hardcodeados;
2. Sustituir cualquier valor real por `process.env` + placeholder (`'change-in-production'`);
3. Ajustar el script si hay falsos positivos;
4. Reejecutar pipeline y adjuntar la URL de run.

**Criterios de aceptación:**
La pipeline pasa y no hay secretos hardcodeados.

**Checklist:**
- [ ] Revisar archivo;
- [ ] Migrar a env;
- [ ] Ajustar grep;
- [ ] Validar pipeline;
- [ ] Cerrar issue.

**Referencia:** [Pipeline Run](https://github.com/NAZCAMEDIA/BRIK-Project-Initializer/actions/runs/17371089078/job/49310566689)