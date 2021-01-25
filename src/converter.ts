import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });
ffmpeg.load();

export type BinaryFile = {
  name: string;
  size: number;
  url: string;
  type: string;
};

async function convert(
  file: File,
  options: string[],
  ext: string,
  type: string,
  outputFileName?: string
): Promise<BinaryFile> {
  const outputName =
    outputFileName ?? `${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));
  await ffmpeg.run("-i", file.name, ...options, `tmp.${ext}`);
  const data = ffmpeg.FS("readFile", `tmp.${ext}`);

  const blob = new Blob([data.buffer], {
    type,
  });

  return {
    name: outputName,
    size: blob.size,
    url: URL.createObjectURL(blob),
    type,
  };
}

export type ConvertHandler = (
  file: File,
  outputFileName?: string
) => Promise<BinaryFile>;

export const convertToGif = (
  file: File,
  outputFileName?: string
): Promise<BinaryFile> =>
  convert(
    file,
    [
      "-filter_complex",
      "[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse",
    ],
    "gif",
    "image/gif",
    outputFileName
  );

export const convertToMp4 = (
  file: File,
  outputFileName?: string
): Promise<BinaryFile> =>
  convert(
    file,
    ["-vcodec", "libx264", "-crf", "20"],
    "mp4",
    "video/mp4",
    outputFileName
  );

export const convertToFavicon = (
  file: File,
  outputFileName?: string
): Promise<BinaryFile> =>
  convert(file, ["-vf", "scale=256:-1"], "ico", "image/x-icon", outputFileName);

export const convertToPng = (
  file: File,
  outputFileName?: string
): Promise<BinaryFile> => convert(file, [], "png", "image/png", outputFileName);

export const convertToJpg = (
  file: File,
  outputFileName?: string
): Promise<BinaryFile> => convert(file, [], "jpg", "image/jpg", outputFileName);
