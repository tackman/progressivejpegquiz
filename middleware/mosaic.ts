export function mosaic(
  source: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  srcCtx: CanvasRenderingContext2D,
  ctx: CanvasRenderingContext2D,
  level: number
) {
  return import("@silvia-odwyer/photon").then((photon) => {
    photon.get_image_data;
    const image = photon.open_image(source, srcCtx);
    const sw = image.get_width() / level;
    const sh = image.get_height() / level;
    const shrinked = photon.resize(image, sw, sh, 1); // filter === Nearest
    const rescaled = photon.resize(
      shrinked,
      image.get_width(),
      image.get_height(),
      1
    );
    console.log(sw, sh);
    photon.putImageData(canvas, ctx, rescaled);
  });
}
