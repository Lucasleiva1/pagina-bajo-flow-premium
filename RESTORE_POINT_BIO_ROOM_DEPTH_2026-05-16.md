# Punto de restauracion importante - Bio Room 3D

Fecha de guardado: 2026-05-16 20:01:07 -03:00
Proyecto: C:\Users\jaell\Desktop\pagina-bajo-flow-premium
Rama: main
Repositorio: https://github.com/Lucasleiva1/pagina-bajo-flow-premium.git

## Nombre del guardado

Tag previsto: important-bio-room-depth-2026-05-16
Mensaje del commit: fix: save bio room depth checkpoint

Este guardado conserva el estado del Bio Room despues de corregir el problema de profundidad visual del panel del fondo y dejar el panel de Leva ordenado para trabajo manual.

## Que contiene este guardado

- El panel negro del fondo del Bio Room ahora vive como geometria real dentro del Canvas 3D, para respetar la profundidad del eje Z.
- El contenido HTML de las paredes queda separado del fondo fisico, para que el texto siga nitido sin tapar a Lucas como una capa falsa.
- El titulo principal del panel frontal queda levantado para no cruzarse con la figura central.
- Las secciones de Leva quedan minimizadas por defecto, asi se ve el indice de controles y se abre solo la seccion que se quiere ajustar.
- Se conserva la app Next.js actual en `http://127.0.0.1:3000/`.

## Verificacion hecha antes del guardado

- `npm.cmd run lint` paso correctamente.
- `npm.cmd run build` paso correctamente.
- `Invoke-WebRequest http://127.0.0.1:3000/` respondio 200 durante la verificacion previa.

## Regla importante para volver a este punto

Antes de restaurar o comparar, verificar siempre:

1. `Get-Location`
2. `git status -sb`
3. `git log --oneline --decorate -5`

Para comparar contra esta version, usar el tag `important-bio-room-depth-2026-05-16`.

No volver a este tag sin que el usuario lo pida explicitamente. Primero abrir y respetar siempre el proyecto actual como esta en disco.
