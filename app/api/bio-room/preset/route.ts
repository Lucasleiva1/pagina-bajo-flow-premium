import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { BioRoomPreset } from "@/data/bioRoomPreset";

const presetPath = path.join(process.cwd(), "data", "bioRoomPreset.ts");

function isPresetSectionRecord(value: unknown): value is Record<string, boolean | number | string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every((entry) => {
    if (typeof entry === "number") return Number.isFinite(entry);
    return typeof entry === "boolean" || typeof entry === "string";
  });
}

function isBioRoomPreset(value: unknown): value is BioRoomPreset {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const preset = value as Record<string, unknown>;
  return (
    isPresetSectionRecord(preset.lucas) &&
    isPresetSectionRecord(preset.room) &&
    isPresetSectionRecord(preset.lights) &&
    isPresetSectionRecord(preset.cinemaLights) &&
    isPresetSectionRecord(preset.visuals) &&
    isPresetSectionRecord(preset.frontWall) &&
    isPresetSectionRecord(preset.bioWall) &&
    isPresetSectionRecord(preset.skillsWall)
  );
}

function serializePreset(preset: BioRoomPreset) {
  return `export type BioRoomPreset = {
  lucas: {
    posX: number;
    posY: number;
    posZ: number;
    width: number;
    height: number;
    emissiveIntensity: number;
  };
  room: {
    halfWidth: number;
    depth: number;
    height: number;
    zBack: number;
  };
  lights: {
    keyPosX: number;
    keyPosY: number;
    keyPosZ: number;
    keyIntensity: number;
    rimPosX: number;
    rimPosY: number;
    rimPosZ: number;
    rimIntensity: number;
    coolPosX: number;
    coolPosY: number;
    coolPosZ: number;
    coolIntensity: number;
    fillPosX: number;
    fillPosY: number;
    fillPosZ: number;
    fillIntensity: number;
    ambientIntensity: number;
  };
  cinemaLights: {
    wallWashY: number;
    wallWashZ: number;
    wallWashIntensity: number;
    wallWashDistance: number;
    sideWashY: number;
    sideWashZ: number;
    sideWashIntensity: number;
    sideWashDistance: number;
    floorBounceY: number;
    floorBounceZ: number;
    floorBounceIntensity: number;
    floorGlowOpacity: number;
    fogNear: number;
    fogFar: number;
    softboxOpacity: number;
  };
  visuals: {
    wallMetalness: number;
    wallRoughness: number;
    floorMetalness: number;
    floorRoughness: number;
    guideOpacity: number;
    panelOpacity: number;
  };
  frontWall: {
    backgroundX: number;
    backgroundY: number;
    backgroundScaleX: number;
    backgroundScaleY: number;
    leftX: number;
    leftY: number;
    leftScale: number;
    leftPanelWidth: number;
    leftPanelHeight: number;
    leftPanelOpacity: number;
    leftTextX: number;
    leftKickerSize: number;
    leftTitleSize: number;
    leftSubtitleSize: number;
    leftBodySize: number;
    leftSmallSize: number;
    leftKickerY: number;
    leftTitleY: number;
    leftSubtitleY: number;
    leftBodyY: number;
    leftSmallY: number;
    leftFont: string;
    rightX: number;
    rightY: number;
    rightScale: number;
    rightPanelWidth: number;
    rightPanelHeight: number;
    rightPanelOpacity: number;
    rightTextX: number;
    rightTitleSize: number;
    rightTitleY: number;
    rightBodySize: number;
    rightFont: string;
    socialIconSize: number;
    socialIconGap: number;
    socialRowY: number;
    socialTextY: number;
  };
  bioWall: {
    contentX: number;
    contentY: number;
    contentScale: number;
    panelX: number;
    panelY: number;
    panelWidth: number;
    panelHeight: number;
    panelOpacity: number;
    titleX: number;
    titleY: number;
    titleSize: number;
    paragraphX: number;
    paragraphOneY: number;
    paragraphTwoY: number;
    paragraphSize: number;
    contributionLabelX: number;
    contributionLabelY: number;
    contributionRowsX: number;
    contributionStartY: number;
    contributionGap: number;
    contributionSize: number;
    sittingImageX: number;
    sittingImageY: number;
    sittingImageWidth: number;
    sittingImageHeight: number;
    sittingImageScale: number;
    sittingImageOpacity: number;
  };
  skillsWall: {
    showFrame: boolean;
    contentX: number;
    contentY: number;
    contentScale: number;
    panelWidth: number;
    panelHeight: number;
    panelOpacity: number;
    frameWidth: number;
    frameHeight: number;
    headerY: number;
    kickerSize: number;
    titleSize: number;
    subtitleSize: number;
    dividerWidth: number;
    dividerY: number;
    cardsY: number;
    thumbWidth: number;
    cardGap: number;
    numberSize: number;
    cardTitleSize: number;
    cardDescriptionSize: number;
    ctaSize: number;
    thumbnailLiftZ: number;
    thumbnailHoverZ: number;
    sittingImageX: number;
    sittingImageY: number;
    sittingImageScale: number;
    sittingImageOpacity: number;
  };
};

export const bioRoomPreset: BioRoomPreset = ${JSON.stringify(preset, null, 2)};
`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "El guardado 3D solo esta habilitado en desarrollo." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);

  if (!isBioRoomPreset(body)) {
    return NextResponse.json(
      { error: "Preset 3D invalido." },
      { status: 400 },
    );
  }

  await writeFile(presetPath, serializePreset(body), "utf8");
  return NextResponse.json({ ok: true });
}
