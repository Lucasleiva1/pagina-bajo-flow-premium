import { SceneShell } from "@/components/SceneShell";
import { SparkIcon } from "@/components/ui/Icons";
import type { SiteCopy } from "@/data/site";

type CraftSceneProps = {
  copy: SiteCopy["craft"];
};

export function CraftScene({ copy }: CraftSceneProps) {
  return (
    <SceneShell className="craft-scene" id="craft">
      <div className="scene-heading craft-heading" data-scene-copy>
        <p className="kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>

      <div className="craft-rail">
        {copy.steps.map((step) => (
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
