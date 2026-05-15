import { SceneShell } from "@/components/SceneShell";

const tags = ["Video editing", "Color grading", "Post audio", "Social media", "Institucionales"];

export function BioScene() {
  return (
    <SceneShell className="bio-scene" id="bio">
      <div className="bio-portrait" data-depth-card>
        <div className="bio-mark" aria-hidden="true">
          BF
        </div>
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
