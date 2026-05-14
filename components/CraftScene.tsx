import { SceneShell } from "@/components/SceneShell";
import { SparkIcon } from "@/components/ui/Icons";
import { craftSteps } from "@/data/site";

export function CraftScene() {
  return (
    <SceneShell className="craft-scene" id="craft">
      <div className="scene-heading craft-heading" data-scene-copy>
        <p className="kicker">Craft sequence</p>
        <h2>Del material crudo a una pieza con pulso.</h2>
        <p>
          No es una lista de servicios. Es el recorrido visual del trabajo: ritmo, atmosfera,
          intencion, sonido y entrega.
        </p>
      </div>

      <div className="craft-rail">
        {craftSteps.map((step) => (
          <article className="craft-card" data-depth-card key={step.title}>
            <span className="craft-number">{step.number}</span>
            <span className={`craft-icon ${step.icon}`} aria-hidden="true">
              <SparkIcon />
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </SceneShell>
  );
}
