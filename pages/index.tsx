/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { none, Option, some, ap, chain } from "fp-ts/Option";
import { pipe, flow } from "fp-ts/function";
import { mosaic } from "../middleware/mosaic";

import styles from "../styles/Quiz.module.css";

const MosaicStep = 5;
const CanvasWidth = 1200;
const CanvasHeight = 800;

export default function Quiz() {
  const [mosaicLevel, setMosaicLevel] = useState<number>(100);
  const [imageName, setImageName] = useState<string>("/white.png");

  useEffect(() => {
    const setImageToCanvas =
      (srcCtx: CanvasRenderingContext2D) => (img: HTMLImageElement) => {
        srcCtx.drawImage(img, 0, 0);
        return "Success";
      };
    const s = pipe(
      some(setImageToCanvas),
      ap(flow(getSourceCanvas, chain(getCanvasContext))()),
      ap(getSourceImage())
    );
    console.log("result", s);
  });

  useEffect(() => {
    console.log("begin source setting");

    const setImageToCanvas =
      (source: HTMLCanvasElement) =>
      (srcCtx: CanvasRenderingContext2D) =>
      (canvas: HTMLCanvasElement) =>
      (ctx: CanvasRenderingContext2D) => {
        mosaic(source, canvas, srcCtx, ctx, mosaicLevel);
        return "Success";
      };
    const s = pipe(
      some(setImageToCanvas),
      ap(getSourceCanvas()),
      ap(flow(getSourceCanvas, chain(getCanvasContext))()),
      ap(getMainCanvas()),
      ap(flow(getMainCanvas, chain(getCanvasContext))())
    );
    console.log("result", s);
  }, [mosaicLevel]);

  return (
    <div>
      {" "}
      <div>
        <button
          onClick={() => {
            const newLevel =
              mosaicLevel - MosaicStep > 0 ? mosaicLevel - MosaicStep : 1;
            setMosaicLevel(newLevel);
          }}
        >
          解除
        </button>

        <button
          onClick={() => {
            const newLevel =
              mosaicLevel + MosaicStep > 100 ? 100 : mosaicLevel + MosaicStep;
            setMosaicLevel(newLevel);
          }}
        >
          強化
        </button>
        <input
          type="password"
          value={imageName}
          onChange={(event) => {
            const v = event.target.value;
            setImageName(v);
          }}
        />
        <button
          onClick={() => {
            setMosaicLevel(100);
          }}
        >
          リセット
        </button>
      </div>
      <canvas
        id="source"
        width={CanvasWidth}
        height={CanvasHeight}
        className={styles.source}
      />
      <canvas
        id="main"
        width={CanvasWidth}
        height={CanvasHeight}
        className={styles.main}
      />
      <img id="source" src={imageName} alt="sample" width="0" height="0" />
    </div>
  );
}

function getCanvasContext(
  canvas: HTMLCanvasElement
): Option<CanvasRenderingContext2D> {
  const ctx = canvas.getContext("2d");
  console.log("getContext", canvas, ctx);
  return ctx ? some(ctx) : none;
}

function getMainCanvas(): Option<HTMLCanvasElement> {
  const element =
    window.document.querySelector<HTMLCanvasElement>("canvas#main");
  return element ? some(element) : none;
}

function getSourceCanvas(): Option<HTMLCanvasElement> {
  const element =
    window.document.querySelector<HTMLCanvasElement>("canvas#source");
  return element ? some(element) : none;
}

function getSourceImage(): Option<HTMLImageElement> {
  const element = window.document.querySelector<HTMLImageElement>("img#source");
  return element ? some(element) : none;
}
