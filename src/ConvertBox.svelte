<script lang="ts">
  import "smelte/src/tailwind.css";
  import { Button, ProgressCircular } from "smelte";
  import type { BinaryFile, ConvertHandler } from "./converter";

  export let title: string;
  export let convertHandler: ConvertHandler;

  let selectedFile: File;
  let promise: Promise<BinaryFile>;

  const changeFile = async (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      promise = convertHandler(selectedFile);
    }
  };

  // noinspection MagicNumberJS
  const toKb = (file: BinaryFile) => `${(file.size / 1024).toFixed()}kb`;
</script>

<div class="container">
  <h5 class="text-gray-500">{title}</h5>
  <div>
    <input
      type="file"
      id="uploader"
      on:change={changeFile}
      style="padding: 30px; width: 480px;" />
  </div>
  {#if selectedFile && promise}
    {#await promise}
      <div
        style="border: dimgrey dotted 1px; padding: 30px"
        class="flex flex-col justify-center">
        {toKb(selectedFile)}のファイルを変換中

        <div class="flex justify-center">
          <ProgressCircular />
        </div>
      </div>
    {:then result}
      <div
        style="border: dimgrey dotted 1px; padding: 30px"
        class="flex flex-col justify-center">
        {#if result.type.startsWith('image/')}
          <img
            src={result.url}
            alt="result"
            style="object-fit: contain; max-height: 480px;" />
        {/if}
        {#if result.type.startsWith('video/')}
          <video
            src={result.url}
            style="object-fit: contain; max-height: 480px;"
            autoplay
            controls />
        {/if}
        <div style="padding: 30px;">
          <div>
            <b>サイズの変化</b>
            <span>{toKb(selectedFile)}</span>
            <span>=></span>
            <span>{toKb(result)}</span>
          </div>
          <a href={result.url} download={result.name}>
            <Button>ダウンロード</Button>
          </a>
        </div>
      </div>
    {:catch error}
      <div
        style="width: 640px; height: 480px; border: #666666 dashed 2px;"
        class="center">
        {error.message}
      </div>
    {/await}
  {/if}
</div>
