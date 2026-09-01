/**
 * VALORES GUARDADOS DEL RENDER DEL PIE.
 *
 * Este archivo lo reescribe el boton "Guardar" del panel de trabajo. Es el
 * puente entre mover deslizadores en el navegador y dejar el resultado fijo
 * en el proyecto: lo que se guarda aca es lo que ve cualquiera que abra la
 * pagina, con panel o sin panel.
 *
 * Cuando el diseno este cerrado se puede sacar el panel entero y estos
 * valores siguen mandando igual.
 */
export type FooterRenderPreset = {
  efectosActivos: boolean;
  efectosEnCelular: boolean;
  suavizado: boolean;
  resplandor: boolean;
  parallax: boolean;
  resolucionInterna: number;
  resplandorIntensidad: number;
  resplandorUmbral: number;
  resplandorRadio: number;
  luzHaz: number;
  luzLente: number;
  luzApertura: number;
  luzParpadeo: number;
  polvoCantidad: number;
  polvoVelocidad: number;
  polvoTamano: number;
  polvoBrillo: number;
  cintaOpacidad: number;
  cintaBalanceo: number;
};

export const footerRenderPreset: FooterRenderPreset = {
  "efectosActivos": false,
  "efectosEnCelular": false,
  "suavizado": true,
  "resolucionInterna": 2,
  "resplandor": false,
  "resplandorIntensidad": 0.32,
  "resplandorUmbral": 0.72,
  "resplandorRadio": 0.65,
  "luzHaz": 1,
  "luzLente": 1,
  "luzApertura": 1,
  "luzParpadeo": 1,
  "polvoCantidad": 1,
  "polvoVelocidad": 1,
  "polvoTamano": 1,
  "polvoBrillo": 1,
  "cintaOpacidad": 1,
  "cintaBalanceo": 1,
  "parallax": true
};
