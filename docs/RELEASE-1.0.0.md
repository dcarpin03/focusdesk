# Propuesta de primera release

**Estado: preparada para revisión; no publicada y sin tag creado.**

- Título propuesto: **FocusDesk 1.0.0 — Primera versión para Windows**.
- Tag propuesto, solo tras aprobación: `v1.0.0`.
- Versión del paquete: `1.0.0`.
- Plataforma objetivo: Windows 10/11 x64; validación automatizada ejecutada en Windows 11.
- Artefacto a adjuntar: `FocusDesk-1.0.0-Windows-x64-Setup.exe`.
- Archivo adicional recomendado: `SHA256SUMS.txt`.
- Firma: **sin firma digital**. Windows SmartScreen puede advertir de un editor desconocido; no se deben desactivar las protecciones de Windows.

## Notas propuestas

FocusDesk permite organizar sesiones de estudio y tareas en una aplicación de escritorio local, sin cuenta ni conexión a Internet.

- Pomodoro de 25, 45 o 50 minutos, con nombre y sección obligatorios.
- Registro automático o anticipado del tiempo estudiado, sin sesiones duplicadas.
- Secciones con nombres y colores propios; eliminación limitada a secciones vacías.
- Tareas completadas/pendientes e historial desplegable por secciones.
- Resumen diario y duraciones legibles; compatibilidad con sesiones antiguas.
- Interfaz Editorial Premium con cuatro temas y fondos JPG, PNG o WebP importados localmente.
- Persistencia de tareas, historial, secciones, preferencias e imágenes al reiniciar.
- Instalador NSIS x64 por usuario, iconos de FocusDesk y desinstalación estándar.

### Consideraciones

Cerrar la aplicación durante una sesión descarta esa sesión activa. Los Pomodoros que cruzan medianoche se asignan al día de finalización. Las sesiones de menos de un segundo no generan registros vacíos. Si falla un guardado, se debe reintentar antes de cerrar.

La aplicación no incluye descansos automáticos, notificaciones, estadísticas ni sincronización en la nube.

El instalador no está firmado. Consulta el [informe de validación](VALIDATION.md), las comprobaciones manuales pendientes y los avisos moderados de herramientas de compilación antes de aprobar la publicación definitiva.

## Artefacto validado

Archivo: `release/1.0.0/FocusDesk-1.0.0-Windows-x64-Setup.exe`.

SHA-256 de esta compilación de prueba:

```text
28da4ce4cd5d810e43d7123524930920970d55485974f981affb1d245de3ac5f
```

Un nuevo empaquetado puede cambiar el checksum. Antes de publicar, calcularlo de nuevo y adjuntar el `SHA256SUMS.txt` que corresponda exactamente al instalador subido.

Página de destino existente: [GitHub Releases de FocusDesk](https://github.com/dcarpin03/focusdesk/releases). No se presupone que exista una descarga de `v1.0.0`.

## Secuencia de publicación pendiente de aprobación

1. Ejecutar las comprobaciones manuales indicadas en `VALIDATION.md`.
2. Confirmar versión, commit de lanzamiento y estado de la auditoría.
3. Generar/verificar el instalador aprobado y su checksum.
4. Obtener aprobación del propietario.
5. Crear el tag `v1.0.0`, publicar la release con estas notas revisadas y adjuntar instalador y checksum.

El bloque de preparación no ejecuta los pasos 4 y 5 automáticamente.
