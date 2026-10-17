# Validación de la versión candidata 1.0.0

Validación ejecutada el **17 de octubre de 2026**, en Windows 11 x64 (build 26200). No equivale a una certificación de compatibilidad en todos los equipos Windows 10/11.

## Resultado técnico

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | Correcto |
| `npm run lint` | Correcto, sin advertencias |
| `npx tsc -p tsconfig.node.json --noEmit` | Correcto |
| `npm run build:app` | Frontend, proceso principal y preload compilados |
| `npm run build` | Instalador NSIS x64 y blockmap generados; publicación desactivada |
| Desarrollo con Vite y Electron | Arranque, almacenamiento y Ajustes comprobados con perfil temporal |
| `npm audit --omit=dev` | 0 vulnerabilidades detectadas |
| `npm audit` completo | 8 avisos moderados; 0 altos y 0 críticos; véase el apartado de seguridad |

Las compilaciones se ejecutaron en una copia aislada del proyecto, con los mismos archivos y dependencias, para no sobrescribir los compilados locales preexistentes. El instalador resultante se copió a `release/1.0.0/`, excluido de Git.

## Pruebas funcionales ejecutadas

Se utilizó Electron real con automatización Playwright desde herramientas de prueba externas al repositorio, perfiles temporales y datos ficticios. No se utilizó el perfil personal de FocusDesk. No se añadió un framework de pruebas ni dependencias de ejecución.

- Pomodoros 25/45/50: campos obligatorios, bloqueo durante la sesión, progreso, parada manual con tiempo real, actualización tras retraso del intervalo, finalización automática, límite de duración, reinicio y prevención de duplicados.
- La comprobación de las duraciones largas utiliza **reloj simulado**, no espera real de 25/45/50 minutos. Se repitió también con el ejecutable instalado.
- Cierre durante una sesión: no crea un registro parcial y vuelve a 25:00 al reiniciar; es el comportamiento existente.
- Tareas: crear, completar, volver a pendiente, eliminar y conservar los datos. Nombres largos sin solapamientos.
- Secciones: crear, elegir color, seleccionar, relacionar con sesiones y eliminar solo las vacías. La validación de nombres vacíos y duplicados se mantiene en interfaz y proceso principal.
- Historial: grupos desplegables, sesiones anteriores sin sección, duración legible, cancelación/confirmación de eliminación individual y actualización del total diario.
- Fecha: simulación de un cambio de día con la aplicación abierta; el total de hoy se recalcula sin modificar el historial.
- Fallos de escritura de tareas/sesiones inyectados en IPC: aviso visible, archivo previo conservado, datos en memoria y reintento correcto sin duplicados. Fallo de lectura: se bloquean escrituras que podrían sobrescribir los datos.
- Ajustes: cuatro temas, persistencia, ausencia del selector de diseños y controles accesibles. Matriz de cuatro temas por once tamaños solicitados; Windows respeta el mínimo de ventana.
- Fondos JPG/PNG/WebP: decodificación, copia independiente del original, límite de tamaño y píxeles, cancelación, formatos incorrectos, archivo corrupto/ausente, reinicio, restablecimiento y rechazo de rutas arbitrarias. Repetido en la aplicación instalada.
- Las pruebas de selector de archivos y confirmación de borrado **simulan la respuesta del diálogo nativo**; sí ejecutan el resto de la lógica, el almacenamiento y los archivos reales.
- Ejecutable empaquetado e instalado: `app.isPackaged === true`, recursos `file://`, estilos, imagen ambiental, nombre FocusDesk y versión 1.0.0; `contextIsolation` y sandbox activos, Node e IPC genérico ausentes en el renderer.
- Capturas reales de la aplicación instalada con datos de demostración, inspeccionadas visualmente y añadidas a `docs/screenshots/`.

## Instalador y recursos de Windows

- Nombre: `FocusDesk-1.0.0-Windows-x64-Setup.exe`.
- NSIS asistido, x64, instalación por usuario, carpeta seleccionable, acceso directo al escritorio y menú Inicio, desinstalador estándar.
- Identificador: `io.github.dcarpin03.focusdesk`.
- Ventana inicial: 1440 × 960; mínimo: 360 × 480. Se mantiene el marco nativo, incluido maximizar.
- Icono ICO con siete resoluciones (16 a 256 px), derivado de la hoja existente. Se verificaron los recursos incrustados en `FocusDesk.exe` y sus metadatos.
- No contiene los iconos de plantilla, archivos de configuración personal ni el código fuente del proyecto. Incluye los paquetes de producción que electron-builder necesita resolver.
- **Sin firma digital**, verificado con Authenticode (`NotSigned`). No se desactivaron SmartScreen, Defender ni protecciones del sistema.

Se ejecutó el instalador silenciosamente en una carpeta de pruebas, sin sobrescribir una instalación existente. Código de salida **0**, ejecutable y desinstalador presentes, accesos directos creados y entrada «FocusDesk 1.0.0» registrada. Se abrió el programa instalado con perfiles temporales y se repitieron pruebas de Pomodoro, imágenes, persistencia, cambio de día y errores de almacenamiento.

La desinstalación silenciosa terminó con código **0**, eliminó ejecutable, accesos directos y registro. Los archivos de configuración de los **15 perfiles de prueba** se conservaron con el mismo hash. Esta prueba usa perfiles explícitos fuera de la instalación; la conservación del directorio predeterminado se apoya además en `deleteAppDataOnUninstall: false` y debe confirmarse en la prueba manual de usuario.

## Correcciones realizadas

1. El resumen diario se actualiza al cambiar de fecha, incluso sin acciones del usuario.
2. Los errores de escritura ya no quedan solo en consola: se muestran y permiten reintentar sin descartar el estado en memoria. Una carga fallida impide guardar listas vacías encima de datos existentes.
3. Identidad y versión de plantilla sustituidas por FocusDesk 1.0.0, iconos propios y configuración Windows. Rutas de assets relativas para producción.
4. Actualizadas dependencias afectadas: Electron 44.9.0, Vite 8.3.4, electron-builder 26.17.0 y plugins compatibles; parches transitivos fijados en el lockfile. `fast-uri` actualizado a 3.1.8.
5. Eliminado el plugin de Node en el renderer, que no se utilizaba. Aislamiento y sandbox explícitos, navegación externa y nuevas ventanas bloqueadas; política de contenido en producción sin scripts inline ni `eval`.
6. El bloqueo de versiones anteriores de electron-builder al extraer enlaces simbólicos de winCodeSign ya no ocurre con la versión actualizada: utiliza edición de recursos con `resedit`. La compilación final pasó **sin la caché especial de prueba** y sin cambiar permisos de Windows.
7. Dejaron de rastrearse los compilados de `dist-electron`, manteniendo sus archivos locales. Ignorados instaladores, salidas, variables privadas y metadatos temporales.

## Seguridad y límites conocidos

La auditoría completa conserva ocho avisos moderados en una única cadena de herramientas: `electron-builder` → `@electron/get` → `global-agent` → `roarr` → `sprintf-js` (incluye los paquetes relacionados que npm marca como afectados). El [aviso de sprintf-js](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) describe agotamiento de recursos con precisiones de formato no acotadas. No hay versión corregida propuesta para ese paquete en la auditoría ejecutada. Esta cadena es de compilación/descarga y no está dentro del ASAR distribuido; no procesa datos de estudio. Se mantiene documentada y pendiente de actualización upstream. No se aplicó `npm audit fix --force` ni se rebajó electron-builder para ocultar el informe.

La revisión sigue las [recomendaciones de seguridad de Electron](https://www.electronjs.org/docs/latest/tutorial/security). No constituye una auditoría de seguridad independiente. Una auditoría npm de producción sin avisos no sustituye la revisión del runtime Electron.

Decisiones existentes conservadas: fecha local de finalización para toda la sesión, sin dividirla a medianoche; cierre sin recuperar la sesión activa; no hay sonidos ni descansos automáticos. Si el usuario cierra la aplicación tras un fallo persistente de escritura, pierde los cambios que solo estén en memoria; el aviso lo indica. Una configuración JSON ilegible no se borra ni se restablece automáticamente: requiere recuperar una copia de seguridad o revisar el archivo, sin reemplazarlo destructivamente.

## Comprobaciones manuales antes de aprobar tag y release

1. Probar en Windows 10 y en un equipo Windows 11 limpio, con usuario sin privilegios de administrador y sin Node/Vite.
2. Recorrer el asistente gráfico: carpeta de destino y opción de acceso directo. Confirmar los iconos en Explorador, barra de tareas y menú Inicio.
3. Verificar procedencia y SHA-256 del instalador; revisar el comportamiento real de SmartScreen sin desactivar protecciones.
4. Completar un Pomodoro real, probar minimizado, suspensión/reanudación y cambio de día real.
5. Usar el selector nativo de imágenes y las confirmaciones nativas de eliminación.
6. Crear datos y fondo, cerrar/reabrir, reinstalar y desinstalar comprobando la conservación del perfil predeterminado. Hacer copia de seguridad antes de estas operaciones con datos reales.
7. Repetir las auditorías antes de publicar y revisar el aviso transitivo pendiente.
8. Aprobar explícitamente el tag y la release. No se han creado ni publicado.
