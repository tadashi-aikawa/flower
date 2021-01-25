import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });
ffmpeg.load();

export type BinaryFile = {
  name: string;
  size: number;
  url: string;
  type: string;
};

export type ConvertHandler = (
  file: File,
  outputFileName?: string
) => Promise<BinaryFile>;

export async function convertToGif(
  file: File,
  outputFileName?: string
): Promise<BinaryFile> {
  const outputName =
    outputFileName ?? `${file.name.replace(/\.[^/.]+$/, "")}.gif`;

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run(
    "-i",
    file.name,
    "-filter_complex",
    "[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse",
    outputName
  );
  const data = ffmpeg.FS("readFile", outputName);

  const blob = new Blob([data.buffer], {
    type: "image/gif",
  });

  return {
    name: outputName,
    size: blob.size,
    url: URL.createObjectURL(blob),
    type: "image/gif",
  };
}

export async function convertToMp4(
  file: File,
  outputFileName?: string
): Promise<BinaryFile> {
  const outputName =
    outputFileName ?? `${file.name.replace(/\.[^/.]+$/, "")}-converted.mp4`;

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run(
    "-i",
    file.name,
    "-vcodec",
    "libx264",
    "-crf",
    "20",
    outputName
  );
  const data = ffmpeg.FS("readFile", outputName);

  const blob = new Blob([data.buffer], {
    type: "video/mp4",
  });

  return {
    name: outputName,
    size: blob.size,
    url: URL.createObjectURL(blob),
    type: "video/mp4",
  };
}

export async function convertToFavicon(
  file: File,
  outputFileName?: string
): Promise<BinaryFile> {
  const outputName =
    outputFileName ?? `${file.name.replace(/\.[^/.]+$/, "")}.ico`;

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, "-vf", "scale=256:-1", outputName);
  const data = ffmpeg.FS("readFile", outputName);

  const blob = new Blob([data.buffer], {
    type: "image/x-icon",
  });

  return {
    name: outputName,
    size: blob.size,
    url: URL.createObjectURL(blob),
    type: "image/x-icon",
  };
}

export async function convertToPng(
  file: File,
  outputFileName?: string
): Promise<BinaryFile> {
  const outputName =
    outputFileName ?? `${file.name.replace(/\.[^/.]+$/, "")}.png`;

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, "-vf", "scale=256:-1", outputName);
  const data = ffmpeg.FS("readFile", outputName);

  const blob = new Blob([data.buffer], {
    type: "image/png",
  });

  return {
    name: outputName,
    size: blob.size,
    url: URL.createObjectURL(blob),
    type: "image/png",
  };
}
