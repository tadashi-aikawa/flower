<script lang="ts">
  import { convertToGif, convertToMp4 } from "./converter";
  import type { BinaryFile } from "./converter";

  let selected: File;
  let promise: Promise<BinaryFile>;
  let convertingWord: string;

  const changeFile = async (e) => {
    selected = e.target.files[0];
  };
  const handleClickGif = async () => {
    convertingWord = "gifに変換中";
    promise = convertToGif(selected);
  };
  const handleClickMp4 = async () => {
    convertingWord = "mp4に変換中";
    promise = convertToMp4(selected);
  };

  const toKb = (file: BinaryFile) => `${(file.size / 1024).toFixed()}kb`;
</script>

<style>
  main {
    text-align: center;
    padding: 10px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: bold;
  }
</style>

<main>
  <h1>Flower</h1>

  <div class="center">
    <div>
      <input
        type="file"
        id="uploader"
        on:change={changeFile}
        style="padding: 30px; width: 480px;" />
    </div>
    {#if selected}
      <div>{toKb(selected)}</div>
      <div style="font-size: 3em;">↓</div>
      <div style="display: flex; gap: 1em;">
        <button on:click={handleClickGif}>gifに変換</button>
        <button on:click={handleClickMp4}>Mp4に変換</button>
      </div>
      {#if promise}
        {#await promise}
          <div
            style="width: 640px; height: 480px; border: #666666 dashed 2px;"
            class="center">
            {convertingWord}
          </div>
        {:then result}
          <div
            style="display: flex; gap: 30px; border: dimgrey dotted 1px; padding: 30px">
            {#if result.type === 'image/gif'}
              <img
                src={result.url}
                alt="result"
                style="object-fit: contain; max-height: 480px;" />
            {/if}
            {#if result.type === 'video/mp4'}
              <video
                src={result.url}
                style="object-fit: contain; max-height: 480px;"
                autoplay
                controls />
            {/if}
            <div style="padding: 30px;">
              <a href={result.url} download={result.name}>
                <button>ダウンロード ({toKb(result)})</button>
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
    {/if}
  </div>
</main>
