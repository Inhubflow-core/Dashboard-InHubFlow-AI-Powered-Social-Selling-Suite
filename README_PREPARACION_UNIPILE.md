# Preparacion antes del trial de Unipile

## Estado actual

La aplicacion puede ejecutarse sin conectar Unipile, pero el modo sin credenciales es una simulacion parcial, no un sandbox de extremo a extremo ni persistencia SaaS. Las pantallas de Inbox, Leads y Pipeline todavia usan fixtures locales. Webhooks y logs de campaña se mantienen en memoria del proceso. No hay configuracion de base de datos ni una suite propia de pruebas automatizadas configurada.

El acceso a Unipile se habilita unicamente cuando existen `UNIPILE_DSN` y `UNIPILE_API_KEY` y `UNIPILE_SANDBOX_MODE` no es `true`. Sin esos valores, no se envian peticiones a Unipile.

## Trabajo realizado en preparacion

- El store de cuentas no precarga perfiles ficticios como cuentas reales. Opcionalmente se puede habilitar un fixture claramente marcado como demo mediante `NEXT_PUBLIC_INHUBFLOW_DEMO_DATA=true`.
- La autenticacion Hosted ya no crea una cuenta local al abrir un enlace; la cuenta debe aparecer tras una autorizacion completada y sincronizacion.
- La autenticacion nativa simulada no agrega una cuenta y presenta un mensaje explicito de que no se conecto LinkedIn.
- Los errores de visita, invitacion y DM en el Campaign Runner quedan marcados como error, no como exito. El pacing se incrementa solo despues de completar la accion.
- El endpoint de simulacion de webhooks queda deshabilitado en produccion, salvo habilitacion explicita con `INHUBFLOW_ENABLE_WEBHOOK_SIMULATOR=true`.

## Antes de abrir el trial

1. Acordar y configurar almacenamiento persistente para cuentas, leads, conversaciones, ejecuciones, pacing y auditoria. No usar `localStorage` o memoria de proceso para afirmar persistencia multi-tenant.
2. Implementar y validar autenticacion/autorizacion server-side y aislamiento por workspace en todas las rutas sensibles.
3. Implementar idempotencia y deduplicacion de webhooks, persistencia y reintentos observables.
4. Asegurar que eventos entrantes alimenten realmente Inbox, Leads y Campaign Runner; actualmente el handler registra resultados recientes en memoria.
5. Crear pruebas automatizadas propias para el cliente Unipile (fetch mock), autenticacion, webhooks HMAC, campaign runner, pacing, Stop on Reply, multi-tenancy y errores.
6. Revisar payloads y endpoints con la documentacion vigente de Unipile y con `inhubflow-b2b` antes de usar una cuenta real.
7. Realizar un ensayo local completo con datos marcados como simulados y acciones externas bloqueadas.

## Checklist del piloto de 7 dias

- Confirmar que la URL/DSN y clave son las correctas y que los secretos no se exponen al navegador ni a logs.
- Conectar una cuenta de prueba por Hosted Auth; verificar sincronizacion y estado desde el servidor.
- Probar lecturas de perfil, chats, mensajes, publicaciones y comentarios antes de cualquier escritura.
- Configurar webhook publico con secret; validar firma, eventos reales, duplicados, reintentos y registros persistidos.
- Probar una sola accion de escritura controlada (DM o invitacion) y verificar estado y auditoria.
- Probar una secuencia con aprobacion humana, Stop on Reply, pacing persistente y limites conservadores.
- Probar desconexion/reconexion, errores del proveedor y recuperacion sin duplicar acciones.
- Registrar resultado, payload sanitizado, fecha y criterio de aceptacion para cada prueba.

## Validacion tecnica ejecutada

- `npm run build`: correcto.
- `npx tsc --noEmit`: correcto.
- `npm run lint`: correcto.

Estas comprobaciones validan compilacion y reglas estaticas, pero no sustituyen pruebas de comportamiento ni integracion real con Unipile.
