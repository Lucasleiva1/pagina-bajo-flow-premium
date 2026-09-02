/**
 * ¿SE MUESTRAN LOS PANELES DE AJUSTE?
 *
 * Son los dos paneles de trabajo: "Render del pie" y "Imagen de la sala".
 * Sirven para acomodar la imagen moviendo perillas y guardar el resultado
 * con el boton Guardar.
 *
 * ---------------------------------------------------------------------
 * PARA VOLVER A VERLOS: cambiar el false de abajo por true, guardar el
 * archivo, y aparecen de nuevo mientras trabajas en local.
 * ---------------------------------------------------------------------
 *
 * Estan ocultos, no borrados. Los valores que se guardaron con ellos
 * siguen mandando igual: viven en data/footerRenderPreset.ts y en
 * data/bioRenderPreset.ts, y la pagina los lee siempre, con panel o sin
 * panel. Ocultarlos no cambia como se ve nada.
 *
 * En la pagina publicada nunca se muestran, pase lo que pase con este
 * valor: la condicion se resuelve al compilar y el panel entero (junto
 * con la libreria Leva) queda fuera de lo que descarga el visitante.
 */
export const PANELES_DE_AJUSTE_VISIBLES = false;
