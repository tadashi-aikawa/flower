import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });
ffmpeg.load();

export type BinaryFile = {
  name: string;
  size: number;
  url: string;
};

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
  };
}
