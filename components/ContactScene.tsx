import { SceneShell } from "@/components/SceneShell";
import { SocialCard } from "@/components/ui/SocialCard";
import type { SiteCopy } from "@/data/site";

type ContactSceneProps = {
  copy: SiteCopy["contact"];
};

export function ContactScene({ copy }: ContactSceneProps) {
  return (
    <SceneShell className="contact-scene" id="contact">
      <div className="contact-copy" data-scene-copy>
        <p className="kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
      </div>

      <div className="social-grid" data-depth-card>
        {copy.socialLinks.map((link) => (
          <SocialCard key={link.href} {...link} />
        ))}
      </div>
    </SceneShell>
  );
}
