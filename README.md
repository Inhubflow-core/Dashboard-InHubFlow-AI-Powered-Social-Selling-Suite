# InHubFlow | Social Selling Suite

> Construye tu Marca Personal y Escala tu Facturación B2B usando el Asistente IA para LinkedIn.

InHubFlow Social Selling Suite es una plataforma avanzada diseñada para transformar el perfil de LinkedIn de fundadores, agencias y equipos comerciales en una máquina inbound de atracción, captura y conversión de clientes potenciales.

---

## Modulos del Sistema

1. **Viral Post Engine**:
   - **Radar Viral**: Extracción y análisis del Top 12 de publicaciones de LinkedIn con mayor interacción.
   - **Modelador IA**: Creación de contenido en formatos Solo Texto, Texto + Imagen (con prompts para Midjourney/Flux) y Carruseles PDF interactivos listos para LinkedIn.
   - **Calendario Drag & Drop**: Planificación editorial con franjas horarias óptimas para audiencias B2B.

2. **Signal Radar (Monitoreo de Intención de Compra)**:
   - **Nivel 1 (Mis Posts)**: Automatización estilo ManyChat para entrega inmediata de Lead Magnets en DM ante palabras clave en comentarios.
   - **Nivel 2 (Competencia)**: Captación de interacciones en posts de competidores.
   - **Nivel 3 (LinkedIn Global)**: Detección de prospectos por términos clave y filtros ICP (cargo y ubicación).

3. **Campañas (Constructor Visual estilo n8n)**:
   - Lienzo de nodos interactivo basado en `@xyflow/react` (React Flow).
   - Nodos de disparadores (Triggers), acciones (visitas, invitaciones, DMs, InMails), lógica (delays con ventana laboral y condiciones) y CRM.
   - Motor de seguridad con jitter humano (3-12 min) y límites diarios para proteger cuentas.

4. **Leads & CRM de Prospectos**:
   - Directorio centralizado con Ficha 360 del contacto y trazabilidad completa.
   - Segmentación dinámica en listas por señal y exportación a CSV.

5. **Inbox Unificado**:
   - Buzón depurado enfocado exclusivamente en ventas.
   - Soporte para notas de voz, adjuntos PDF y respuestas inteligentes sugeridas por **SDR Co-Pilot**.
   - Acciones directas para mover etapas en el pipeline y enviar enlaces de reuniones.

6. **Pipeline CRM & Calendario Comercial**:
   - Tablero Kanban de 7 etapas con drag & drop y métricas de MRR en tiempo real.
   - Calendario comercial integrado con sincronización y ajuste automático de zona horaria.

---

## Tecnologias

- **Framework**: Next.js 16 (App Router & Turbopack)
- **UI & Estilos**: Tailwind CSS V4 (Color primario de marca `#0099ff`)
- **Lienzo de Secuencias**: `@xyflow/react`
- **Renderizado PDF**: `jspdf`
- **Iconos**: `lucide-react`
- **Tipografia**: Outfit / Inter

---

## Instalacion y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para produccion
npm run build

# Iniciar servidor de produccion
npm run start
```

---

## Documentacion

Para conocer las especificaciones técnicas completas y reglas de producto, consulte [PROYECTO_INHUBFLOW_SOCIAL_SELLING.md](./PROYECTO_INHUBFLOW_SOCIAL_SELLING.md).
