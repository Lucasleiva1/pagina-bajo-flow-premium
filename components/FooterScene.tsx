import { SceneShell } from "@/components/SceneShell";
import type { SiteCopy } from "@/data/site";

type FooterSceneProps = {
  copy: SiteCopy["footer"];
};

export function FooterScene({ copy }: FooterSceneProps) {
  return (
    <SceneShell className="footer-scene" id="footer">
      <div className="footer-mark" data-scene-copy>
        <p className="kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <span>{copy.location}</span>
      </div>
    </SceneShell>
  );
}
