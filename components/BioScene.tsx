import { SceneShell } from "@/components/SceneShell";
import { BioRoomExperience } from "@/components/bio-room/BioRoomExperience";
import type { SiteCopy } from "@/data/site";

type BioSceneProps = {
  copy: SiteCopy["bio"];
  isActive: boolean;
};

export function BioScene({ copy, isActive }: BioSceneProps) {
  return (
    <SceneShell className="bio-scene" id="bio">
      <BioRoomExperience copy={copy} isActive={isActive} />
    </SceneShell>
  );
}
