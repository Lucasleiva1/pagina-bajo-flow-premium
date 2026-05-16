export type Vec3 = [number, number, number];
export type WallName = "backWall" | "characterRightWall" | "characterLeftWall";

export type RoomMeasurements = {
  halfWidth: number;
  depth: number;
  height: number;
  zBack: number;
};

export type WallSurface = {
  name: WallName;
  position: Vec3;
  rotation: Vec3;
  width: number;
  height: number;
  surfaceOffset: number;
};

export type BioRoomLayout = RoomMeasurements & {
  centerZ: number;
  walls: Record<WallName, WallSurface>;
};

const SURFACE_OFFSET = 0.045;

export function createBioRoomLayout({
  depth,
  halfWidth,
  height,
  zBack,
}: RoomMeasurements): BioRoomLayout {
  const centerZ = zBack + depth / 2;

  return {
    centerZ,
    depth,
    halfWidth,
    height,
    zBack,
    walls: {
      backWall: {
        name: "backWall",
        position: [0, height / 2, zBack],
        rotation: [0, 0, 0],
        width: halfWidth * 2,
        height,
        surfaceOffset: SURFACE_OFFSET,
      },
      characterRightWall: {
        name: "characterRightWall",
        position: [-halfWidth, height / 2, centerZ],
        rotation: [0, Math.PI / 2, 0],
        width: depth,
        height,
        surfaceOffset: SURFACE_OFFSET,
      },
      characterLeftWall: {
        name: "characterLeftWall",
        position: [halfWidth, height / 2, centerZ],
        rotation: [0, -Math.PI / 2, 0],
        width: depth,
        height,
        surfaceOffset: SURFACE_OFFSET,
      },
    },
  };
}
