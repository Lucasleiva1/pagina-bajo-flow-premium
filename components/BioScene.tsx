import Image from "next/image";
import { SceneShell } from "@/components/SceneShell";

const tags = ["Video editing", "Color grading", "Post audio", "Social media", "Institucionales"];

export function BioScene() {
  return (
    <SceneShell className="bio-scene" id="bio">
      <div className="bio-portrait" data-depth-card>
        <Image
          alt="Retrato de Lucas Leiva"
          height={1200}
          priority={false}
          src="/assets/bio-lucas.png"
          width={1200}
        />
      </div>

      <div className="bio-copy" data-scene-copy>
        <p className="kicker">Bio</p>
        <h2>Soy Lucas, editor de video enfocado en transformar piezas audiovisuales.</h2>
        <p>
          Trabajo cada proyecto desde el ritmo, la atmosfera y la emocion para que cada corte
          tenga una razon.
        </p>
        <p>
          Bajo Flow nace para crear contenido con identidad: videos para YouTube, redes sociales,
          marcas e institucionales.
        </p>
        <div className="tag-list">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
