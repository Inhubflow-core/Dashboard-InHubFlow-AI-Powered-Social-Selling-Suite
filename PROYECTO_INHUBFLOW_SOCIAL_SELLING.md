# InHubFlow | Social Selling Suite
## Documento de Especificación Técnica & Arquitectura de Producto (PRD)
**Versión:** 2.1 (Revisión de Normas, Colorimetría y Arquitectura)  
**Fecha:** Octubre 2026  
**Estado:** Documento Maestro Aprobado  

---

## 1. Reglas Mandatorias del Proyecto

Las siguientes directrices son de cumplimiento estricto para todo el ciclo de diseño, arquitectura y desarrollo:

1. **Referencia Visual y Template Oficial**:
   * Toda la interfaz, navegación, componentes, maquetación y estilos provienen del template ubicado en:  
     `InHubFlow - Social Selling/nextjs-admin-dashboard-main`.
   * No se deben inventar estructuras visuales ajenas a este template.

2. **Referencia Técnica Exclusiva (Hermano Mayor)**:
   * Para cualquier solución técnica, cliente de Unipile, lógica de escáneres de señales, algoritmos de extracción y modelos de datos, se debe consultar **únicamente** la carpeta `inhubflow-b2b`.
   * Ninguna otra carpeta externa debe usarse como referencia técnica.

3. **Color Dominante Principal**:
   * El color primario y dominante de la identidad de marca es: **`#0099ff`** (Azul InHubFlow).
   * Este código de color rige botones principales, bordes activos, acentos de navegación, badges de estado destacados y gráficos.

4. **Política de Cero Emoticonos (Sin Emojis)**:
   * Queda terminantemente prohibido el uso de emoticonos o emojis en la documentación, en el código fuente, en los textos de la interfaz de usuario y en cualquier comunicación del sistema.
   * La interfaz y la documentación deben mantener un estándar corporativo, sobrio y profesional.

---

## 2. Visión y Propuesta de Valor

"Construye tu Marca Personal y Escala tu Facturación B2B usando el Asistente IA para LinkedIn"

InHubFlow - Social Selling es la plataforma hermana de InHubFlow B2B, diseñada para transformar el perfil de LinkedIn de fundadores, agencias y equipos comerciales en una máquina inbound de atracción, captura y conversión de clientes potenciales.

A diferencia del outreach en frío tradicional, esta suite combina:
1. **Viral Post Engine**: Creación y programación de contenido viral (posts de texto, posts con imagen y carruseles PDF visuales) para un mes completo en 5 minutos.
2. **Signal Radar de 3 Niveles**: Detección en tiempo real de prospectos con intención de compra que interactúan con tus posts (Lead Magnets ManyChat), con los de tu competencia o con posts clave de la red.
3. **Constructor Visual de Campañas (Estilo n8n)**: Un lienzo (canvas drag-and-drop) con nodos interactivos para diseñar flujos de prospección multietapa, con retardos humanos, bifurcaciones lógicas y envío de materiales (PDFs, audios y DMs).
4. **CRM Pipeline & Unified Inbox**: Gestión sin fricción desde el comentario inicial hasta la reunión comercial agendada en el calendario.

---

## 3. Mapa de Módulos del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 INHUBFLOW SOCIAL SELLING SUITE                                  │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│ 1. VIRAL POST     │ 2. SIGNAL RADAR   │ 3. CAMPAÑAS (n8n) │ 4. LEADS & INBOX  │ 5. PIPELINE CRM │
│ - Radar Viral     │ - Nivel 1: Mis    │ - Canvas de Nodos │ - Listas por      │ - Kanban Sales  │
│   (Top 12 posts)  │   Posts (ManyChat)│   (React Flow)    │   Señal           │   Pipeline      │
│ - Modelador IA    │ - Nivel 2: Posts  │ - Triggers &      │ - Perfiles 360    │ - Calendario de │
│   (Texto/Img/PDF) │   Competencia     │   Acciones        │ - Inbox sin ruido │   Reuniones     │
│ - Calendario Drag │ - Nivel 3: Posts  │ - Delays y Pacing │ - Detección de    │ - Métricas de   │
│   and Drop        │   Globales        │   Humano          │   Respuestas      │   Conversión    │
└───────────────────┴───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

---

## 4. Especificación Detallada de Módulos

### MÓDULO 1: VIRAL POST (Generación & Programación de Contenido)

El objetivo de este módulo es posicionar la autoridad del perfil y generar el tráfico orgánico que alimenta los monitores de señales.

#### 1.1 Radar Viral
* **Búsqueda Inteligente**: El usuario ingresa un tema o palabra clave (ej. "Prospección con IA", "Social Selling B2B", "Outreach en LinkedIn").
* **Extracción de Top 12 Posts Virales**: Mediante búsquedas curadas e indexadas en LinkedIn, el sistema extrae las 12 publicaciones con mayor tracción reciente (ordenadas por volumen de Likes, Comentarios y Ratio de Interacción).
* **Vista en Cuadrícula de Tarjetas**:
  * Muestra autor, foto, titular, fecha y métricas de impacto (Likes, Comentarios, Compartidos).
  * Resumen del gancho (Hook) y primeras 3 líneas.
  * Modal de Lectura Completa: Permite visualizar el post íntegro, el formato original y la imagen/carrusel adjunto.
  * Botón de Acción Principal: "Modelar con IA" (acento en `#0099ff`).

#### 1.2 Modelador de Contenido con IA (Modal de Creación)
Al hacer clic en "Modelar con IA", se abre un configurador interactivo donde el usuario elige entre 3 Formatos:

1. **Formato "Solo Texto"**:
   * La IA analiza la estructura ganadora del post original (hook, storytelling, desarrollo, llamada a la acción) y reescribe un post original adaptado al tono de voz y oferta del usuario.
   * Editor de texto enriquecido con contador de caracteres y previsualización exacta de LinkedIn.
   * Botones: "Publicar Ahora" o "Programar".

2. **Formato "Texto + Imagen"**:
   * Genera el copy del post optimizado para acompañar un recurso visual.
   * Generador de Prompt Visual: La IA crea un prompt detallado optimizado para generadores de imágenes (Midjourney, Flux, DALL-E) que representa conceptualmente el mensaje del post.
   * Controles:
     * Botón "Copiar Prompt para IA".
     * Botón "Subir Imagen" (drag & drop con recorte y compresión).
     * Botones: "Publicar Ahora" o "Programar".

3. **Formato "Carrusel de Diapositivas (PDF para LinkedIn)"**:
   * **Generador de Diapositivas**: La IA desglosa el contenido en 5 a 10 diapositivas estructuradas:
     * Slide 1 (Portada): Titular magnético, gancho visual y autor.
     * Slides 2 a N-1 (Cuerpo): Puntos clave, diagramas explicativos, listas accionables o frameworks.
     * Slide Final (CTA): Llamada a la acción clara (ej. "Comenta SISTEMA para recibir la plantilla completa").
   * **Personalizador de Estilo Visual**:
     * Selección de paleta de colores corporativos con énfasis en `#0099ff`.
     * Tipografías de alto impacto (Nordique Pro, Inter, Montserrat).
     * Inclusión automática de logo, foto del autor y handle de LinkedIn (@tuperfil).
   * **Renderizador PDF Automático**: El sistema genera el archivo .pdf optimizado en vector/canvas listo para descargarse o para adjuntarse directamente a la publicación mediante la API de Unipile.

#### 1.3 Lista de Posts Creados (Vista de Gestión)
* Lista horizontal moderna con tarjetas a lo ancho:
  * Estado visual: Borrador | Programado | Publicado | Error.
  * Vista previa del formato (badge de Texto, Imagen o Carrusel).
  * Métricas post-publicación si ya fue emitido (Likes, Comentarios, Impresiones).
  * Acciones: Editar, Reprogramar, Publicar Inmediato, Eliminar.

#### 1.4 Calendario Editorial Drag & Drop
* Vista interactiva mensual, semanal y diaria (basada en el componente de calendario de `nextjs-admin-dashboard-main`).
* Indicadores de Horarios Óptimos de LinkedIn (franjas con mayor pico de actividad en la audiencia B2B).
* Capacidad de arrastrar (drag & drop) cualquier post entre días y horas para reprogramarlo al instante.

---

### MÓDULO 2: SIGNAL RADAR (Monitoreo de Intención de Compra)

El Radar de Señales convierte las interacciones pasivas de LinkedIn en prospectos listos para entrar al embudo de ventas.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA SIGNAL RADAR                            │
├─────────────────────┬───────────────────────────┬──────────────────────────────┤
│ NIVEL 1: MIS POSTS  │ NIVEL 2: COMPETENCIA      │ NIVEL 3: LINKEDIN GLOBAL     │
│ (Lead Magnet /      │ (Auditoría de Cuentas     │ (Monitoreo de Tendencias y   │
│ Flujo ManyChat)     │ Rivales)                  │ Palabras Clave)              │
├─────────────────────┼───────────────────────────┼──────────────────────────────┤
│ - Disparador:       │ - Disparador:             │ - Disparador:                │
│   Palabra Clave en  │   Likes / Comentarios en  │   Likes / Comentarios en     │
│   comentarios (ej.  │   posts de perfiles de    │   publicaciones virales de   │
│   "SISTEMA")        │   competidores            │   LinkedIn con keywords      │
│ - Intención:        │ - Intención:              │ - Intención:                 │
│   Muy Alta (Pide el │   Media-Alta (Interesados │   Media (Audiencia activa    │
│   recurso directo)  │   en soluciones rivales)  │   en la temática)            │
│ - Flujo:            │ - Flujo:                  │ - Flujo:                     │
│   Conectar + DM     │   Visitar -> Conectar con │   Visita -> Validación ICP ->│
│   con PDF adjunto   │   contexto de la temática │   Conectar con enfoque suave │
└─────────────────────┴───────────────────────────┴──────────────────────────────┘
```

#### Nivel 01: Mis Posts (Lead Magnet / Automatización ManyChat)
* **Objetivo**: Captura instantánea de leads a partir de posts propios con incentivos (Lead Magnets).
* **Mecánica**:
  1. El usuario publica un post o carrusel con un llamado a la acción: *"Comenta la palabra SISTEMA y te envío por privado la Guía en PDF"*.
  2. El monitor escucha periódicamente los comentarios de esa publicación.
  3. Al detectar la palabra clave configurada (SISTEMA, GUIA, PLANTILLA, etc.):
     * Paso A (Impulso Algorítmico): Da Like al comentario del usuario y responde un mensaje público: *"Te lo acabo de enviar por privado, revisa tus mensajes"*.
     * Paso B (Validación de Conexión):
       * Si ya es contacto de 1er grado: Envía de inmediato el DM con el archivo PDF adjunto.
       * Si no están conectados: Envía solicitud de conexión con nota personalizada contextual:
         > "Hola {{first_name}}, vi que comentaste 'SISTEMA' en mi post. Te envío la invitación para poder entregarte la guía por mensaje privado. Saludos."
       * Una vez que acepta la conexión: El sistema detecta el cambio de estado y dispara el mensaje directo con el PDF.

#### Nivel 02: Posts de la Competencia
* **Objetivo**: Prospectar a las personas que interactúan activamente con competidores directos.
* **Mecánica**:
  1. Configuración de cuentas objetivo (ej. perfiles de fundadores, agencias o empresas rivales como Adapta IA).
  2. Filtrado por palabra clave en el contenido del post (ej. "Prospección B2B", "Agentes IA").
  3. Extracción de los perfiles que dejaron Like o Comentario.
  4. Disparo de secuencia relacional:
     > "Hola {{first_name}}, vi tu interacción en el post de [Competidor] sobre {{tema}}. Me pareció muy interesante tu punto de vista sobre... ¿cómo lo están abordando en {{company}}?"

#### Nivel 03: Posts Globales de LinkedIn
* **Objetivo**: Captar interacciones sobre tópicos específicos en cualquier publicación de la red.
* **Mecánica**:
  1. Búsqueda de posts populares con base en términos de búsqueda clave.
  2. Escaneo de interacciones (Likes/Comentarios) filtrando perfiles según criterios de ICP (Cargo y Ubicación).
  3. Entrada automática al embudo de prospección.

---

### MÓDULO 3: CAMPAÑAS (Constructor Visual de Secuencias Estilo n8n)

Este es el núcleo operativo de la plataforma. La construcción de secuencias se realiza a través de un **Lienzo Basado en Nodos (Node Graph Canvas)** utilizando **React Flow (`@xyflow/react`)**.

```
  [ TRIGGER: Monitor Nivel 1 ("SISTEMA") ]
                      │
                      ▼
            [ ACCION: Visitar Perfil ]
                      │
                      ▼
         [ CONDICION: ¿Es Contacto de 1er Grado? ]
             ├── SI ──────────────────────────────────────┐
             │                                            │
             └── NO ──► [ ACCION: Enviar Invitación ]     │
                                    │                     │
                                    ▼                     │
                     [ DELAY: Esperar Aceptación ]        │
                            (Máximo 5 días)               │
                                    │                     │
                                    ▼                     │
                     [ CONDICION: ¿Aceptó? ]              │
                         ├── SI ◄─────────────────────────┘
                         │       │
                         │       ▼
                         │  [ ACCION: Enviar DM + Adjuntar PDF Lead Magnet ]
                         │       │
                         │       ▼
                         │  [ DELAY: Esperar 48 Horas ]
                         │       │
                         │       ▼
                         │  [ CONDICION: ¿Respondió al Mensaje? ]
                         │       ├── SI ──► [ DETENER SECUENCIA & MOVER A KANBAN "Interesado" ]
                         │       └── NO ──► [ ACCION: Enviar Follow-up o Audio ]
                         │
                         └── NO ──► [ ACCION ALTERNATIVA: Enviar Sales Nav InMail (Opcional) ]
```

#### 3.1 Catálogo de Nodos Disponibles

| Categoría | Código | Nombre del Nodo | Configuración Técnica |
| :--- | :---: | :--- | :--- |
| **TRIGGER** | TR-01 | **Signal Monitor Trigger** | Selecciona el Monitor fuente (Nivel 1, Nivel 2 o Nivel 3) y la regla de activación. |
| **TRIGGER** | TR-02 | **Lead List Trigger** | Dispara el flujo para una lista importada de contactos (CSV o búsqueda). |
| **ACTION** | AC-01 | **Visitar Perfil** | Ejecuta visita mediante Unipile para figurar en las notificaciones del prospecto. |
| **ACTION** | AC-02 | **Like a Último Post** | Reacciona al post más reciente del prospecto (Likes humanos). |
| **ACTION** | AC-03 | **Comentar con IA** | Genera y publica un comentario contextual positivo en el último post del lead. |
| **ACTION** | AC-04 | **Enviar Invitación** | Solicita conexión. Configurable: Sin nota o Con nota personalizada (`{{first_name}}`, `{{company}}`). |
| **ACTION** | AC-05 | **Enviar Mensaje (DM)** | Envía DM en LinkedIn. Soporta texto, notas de voz (audio) y adjuntos (PDFs o imágenes). |
| **ACTION** | AC-06 | **InMail Sales Navigator** | Para cuentas con Sales Nav; envía InMail a prospectos fuera de red sin consumir conexión. |
| **LOGIC** | LG-01 | **Delay / Retardo** | Configura tiempo de espera (ej. 24h, 3 días) y ventana de horario laboral (L-V de 09:00 a 18:00). |
| **LOGIC** | LG-02 | **Condición Lógica** | Evalúa ramas: ¿Es contacto?, ¿Aceptó en X tiempo?, ¿Respondió al mensaje? |
| **CRM** | CR-01 | **Actualizar Etapa CRM** | Mueve automáticamente la tarjeta del prospecto en el Kanban del Pipeline. |
| **CONTROL** | CT-01 | **Finalizar Flujo** | Concluye la secuencia para el prospecto. |

#### 3.2 Motor de Seguridad y Pacing Humano
* **Límites Diarios Configurables**:
  * Máximo 20–25 invitaciones de conexión al día.
  * Máximo 30–40 mensajes directos al día.
* **Intervalos Aleatorios (Jitter)**:
  * Entre cada acción consecutiva, el sistema introduce pausas variables de 3 a 12 minutos simulando el comportamiento de un usuario real.
* **Detección Automática de Respuesta**:
  * En cuanto el prospecto responde a cualquier mensaje, la automatización para ese contacto se detiene de inmediato y se genera notificación en el Inbox.

---

### MÓDULO 4: LEADS & CRM DE PROSPECTOS

Centro de administración de contactos captados por el ecosistema.

* **Segmentación por Listas**: Cada monitor de señales alimenta su propia lista dinámica (ej. "Leads Nivel 1 - Post SISTEMA", "Leads Competencia - Adapta IA").
* **Ficha 360 del Contacto**:
  * Datos personales: Nombre, Cargo, Empresa, Ubicación, Foto de perfil, URL de LinkedIn.
  * Datos de contacto: Email y teléfono (si están públicos o fueron compartidos).
  * Historial de Flujo: Registro cronológico de cada paso de la campaña.
  * Estado de la Secuencia: En Progreso, Respondido, Completado, Pausado.
* **Exportación**: Exportación a CSV y opciones de sincronización.

---

### MÓDULO 5: INBOX UNIFICADO (Enfocado en Conversión)

Un buzón de mensajería diseñado exclusivamente para ventas, eliminando el ruido de LinkedIn.

* **Bandeja Filtrada por Campañas**: Solo se muestran las conversaciones generadas a través de secuencias y monitores activos.
* **Soporte Multimedia**: Visualización y envío de texto, notas de voz y documentos PDF adjuntos.
* **Sugerencias de Respuesta con IA (SDR Co-Pilot)**:
  * La IA analiza la respuesta del prospecto y sugiere 3 respuestas inteligentes con un clic para avanzar hacia el agendamiento.
* **Acciones Rápidas en el Chat**:
  * Botón para mover de etapa en el Kanban (marcar como "Interesado" o "Reunión Agendada").
  * Envío con un clic del enlace de agendamiento de reuniones.

---

### MÓDULO 6: PIPELINE & CALENDARIO COMERCIAL

El puente entre las conversaciones en LinkedIn y las reuniones cerradas.

#### 6.1 Tablero Kanban Comercial
Flujo de estados visual con tarjetas arrastrables:
1. **Lead Captado**: Interacción registrada en el monitor.
2. **En Secuencia**: Flujo de automatización activo (visita/conexión).
3. **Conectado / Material Entregado**: Contacto de 1er grado con el recurso entregado.
4. **Conversación Activa / Interesado**: El lead respondió positivamente al mensaje.
5. **Reunión Agendada**: Cita pactada en el calendario.
6. **Propuesta Presentada**: En fase de negociación u oferta comercial.
7. **Ganado (Closed Won)** / **Perdido (Closed Lost)**.

#### 6.2 Calendario Integrado
* Vista de disponibilidad y reuniones agendadas (basada en el layout de `nextjs-admin-dashboard-main`).
* Integración con proveedores de calendario (Google Calendar, Outlook) y enlaces de agendamiento.
* Detección y ajuste automático de zona horaria.

---

## 5. Arquitectura Técnica y Fuente de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND & INTERFAZ DE USUARIO                         │
│  - Template Base: nextjs-admin-dashboard-main (Next.js + Tailwind CSS)     │
│  - Color Dominante: #0099ff en acentos, botones primarios y gráficos        │
│  - Canvas de Secuencias: @xyflow/react (React Flow)                         │
│  - Iconografía: Lucide React (Sin emoticonos)                               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    SERVICIOS TÉCNICOS & HERMANO MAYOR                       │
│  - Consultar Unicamente: inhubflow-b2b                                       │
│  - Cliente Unipile: Métodos validados de lib/unipile/client.ts              │
│  - Escáneres de Señales: lib/signals/scanners/index.ts (Nivel 1, 2 y 3)      │
│  - Persistencia: Modelos de datos PostgreSQL / Supabase                      │
│  - Generación de Carruseles: Conversión de esquemas a PDF vectorial         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Arquitectura SaaS, Sistema Multislots y Modelo de Roles

Siguiendo el modelo validado en `inhubflow-b2b`, la plataforma opera bajo una arquitectura SaaS multi-tenant con control estricto de cupos (slots) de cuentas de LinkedIn conectables.

### 7.1 Jerarquía de Roles
1. **Super Admin (Roberto OrSe / inhubflow@gmail.com)**:
   * Control maestro de toda la infraestructura y del SaaS.
   * Capacidad ilimitada (999 slots asignados).
   * Acceso exclusivo al **Panel de Administracion SaaS** (`/admin/subscribers`), donde puede auditar a todos los clientes, crear suscriptores manualmente, modificar planes/slots, suspender cuentas y alternar la vista a cualquier organizacion para soporte y auditoria.
2. **Admin de Cuenta / Cliente (Tenant Admin / Workspace Owner)**:
   * Cada suscriptor es el Administrador de su empresa/organizacion.
   * Administra sus slots contratados (1, 5 o 10 perfiles).
   * Puede invitar a operadores/colaboradores en el modulo de Equipo (`/team`) y asignarles cuentas especificas de su cuota.
   * Al alcanzar el tope de slots contratados, el sistema bloquea nuevas vinculaciones y ofrece la opcion de upgrade de plan.

### 7.2 Los 3 Planes Oficiales de Multislots

| Parametro | Plan Starter | Plan Growth (Recomendado) | Plan Business |
| :--- | :---: | :---: | :---: |
| **Slots de LinkedIn** | **1 Cuenta Conectada** | **5 Cuentas Conectadas** | **10 Cuentas Conectadas** |
| **Audiencia Objetivo** | Fundadores, consultores y creadores | Agencias en expansion y equipos SDR | Agencias consolidadas y grandes ventas |
| **Operadores de Equipo** | 1 Usuario (Solo el Admin) | 1 Admin + hasta 5 miembros | 1 Admin + hasta 10 miembros |
| **Viral Post Engine** | Completo (Texto, Imagen y PDF) | Ilimitado | Ilimitado con soporte prioritario |
| **Signal Radar** | Nivel 1, 2 y 3 (Hasta 5 monitores) | Nivel 1, 2 y 3 (Hasta 20 monitores) | Monitores ilimitados en tiempo real |
| **Campañas Activas** | Hasta 3 campanas simultaneas | Campanas ilimitadas | Campanas ilimitadas multi-cuenta |
| **Pacing Humano** | Si (20-25 inv/dia, 30 DMs/dia) | Si (por cada cuenta conectada) | Si (con rotacion balanceada) |
| **Precio Mensual** | $49 / mes | $149 / mes | $279 / mes |
| **Precio Anual (-20%)** | $39 / mes | $119 / mes | $229 / mes |

### 7.3 Asistente SDR IA (Réplica de la Arquitectura de `inhubflow-b2b`)

El módulo del Asistente SDR IA (`/sdr`) replica fielmente el motor conversacional y de seguridad de `inhubflow-b2b`:

1. **4 Modos Operativos Configurables**:
   * **Desactivado (Off)**: Agente pausado sin procesar mensajes entrantes.
   * **Modo Sombra (Shadow)**: Analiza y clasifica respuestas en segundo plano para medir efectividad sin enviar nada al lead.
   * **Supervisión con Aprobación (Approval - Human-in-the-Loop)**: Modo por defecto. Genera borradores contextuales que se encolan para revisión humana de un solo clic.
   * **Autónomo Seguro (Auto)**: Responde directamente en LinkedIn únicamente si la confianza supera el umbral configurado (ej. 85%) y el nivel de riesgo es bajo.

2. **Clasificación Estructurada de Intenciones (Gemini 3.6 Flash)**:
   * Detecta 14 intenciones comerciales: `interested`, `meeting_request`, `pricing_question`, `product_question`, `objection`, `integration_question`, `proposal_request`, `not_interested`, `unsubscribe`, `human_requested`, `referral`, `ooo`, `ambiguous` y `hostile_or_legal`.

3. **Base de Conocimiento Aprobada (RAG Ligero)**:
   * Evita alucinaciones comerciales limitando las respuestas a documentos aprobados en 5 categorías: Propuesta de Valor, Precios y Planes, Manejo de Objeciones, Protocolos de Reunión y Reglas de Handoff.

4. **Cola de Aprobaciones Human-in-the-Loop**:
   * Interfaz interactiva donde los operadores pueden aprobar y despachar a LinkedIn, editar el borrador, escalar a un humano o descartar la acción.

5. **Puertas de Seguridad (Promotion Gates)**:
   * 5 comprobaciones técnicas que certifican la salud del modelo, base de conocimiento y políticas de seguridad antes de habilitar el modo autónomo.

6. **Simulador Interactivo (Playground)**:
   * Consola de pruebas en tiempo real con latencia medida en milisegundos, citas de conocimiento aplicadas y resumen de razonamiento de la IA.

---

## 8. Próximos Pasos para Ejecución

1. **Revisión del Template**: Verificar dependencias y estructura de `nextjs-admin-dashboard-main`.
2. **Integración de Identidad**: Aplicar el color primario `#0099ff` y configurar la navegación con los 6 módulos más Administración SaaS.
3. **Desarrollo del Canvas n8n**: Montar el lienzo `@xyflow/react` para el módulo de Campañas.
4. **Integración con Servicios Técnicos de `inhubflow-b2b`**: Conectar el cliente Unipile, los escáneres de señales y el motor de multislots.
5. **Generador de Carruseles y Radar Viral**: Implementar la suite de contenido del Módulo 1.

