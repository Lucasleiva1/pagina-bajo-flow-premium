import { SceneShell } from "@/components/SceneShell";
import { BioRoomExperience } from "@/components/bio-room/BioRoomExperience";
import type { SiteCopy } from "@/data/site";

type BioSceneProps = {
  copy: SiteCopy["bio"];
};

export function BioScene({ copy }: BioSceneProps) {
  return (
    <SceneShell className="bio-scene" id="bio">
      <BioRoomExperience copy={copy} />
    </SceneShell>
  );
}
