import { SceneShell } from "@/components/SceneShell";
import { SocialCard } from "@/components/ui/SocialCard";
import { socialLinks } from "@/data/site";

export function ContactScene() {
  return (
    <SceneShell className="contact-scene" id="contact">
      <div className="contact-copy" data-scene-copy>
        <p className="kicker">Contact</p>
        <h2>Hagamos que tu pieza se sienta de cine.</h2>
        <p>
          Si queres que tu contenido tenga ritmo, imagen, sonido y presencia, escribime por la red
          que uses.
        </p>
      </div>

      <div className="social-grid" data-depth-card>
        {socialLinks.map((link) => (
          <SocialCard key={link.href} {...link} />
        ))}
      </div>
    </SceneShell>
  );
}
