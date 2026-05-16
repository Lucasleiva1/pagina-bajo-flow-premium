import { SceneShell } from "@/components/SceneShell";
import type { SiteCopy } from "@/data/site";

type BioSceneProps = {
  copy: SiteCopy["bio"];
};

export function BioScene({ copy }: BioSceneProps) {
  return (
    <SceneShell className="bio-scene" id="bio">
      <div className="bio-portrait" data-depth-card>
        <div className="bio-mark" aria-hidden="true">
          BF
        </div>
      </div>

      <div className="bio-copy" data-scene-copy>
        <p className="kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="tag-list">
          {copy.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
