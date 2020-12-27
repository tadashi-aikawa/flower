<script lang="ts">
  import { convertToGif } from "./converter";
  import type { BinaryFile } from "./converter";

  let selected: File;
  let gifPromise: Promise<BinaryFile>;

  export const changeFile = async (e) => {
    selected = e.target.files[0];
  };
  export const handleClickGif = async () => {
    gifPromise = convertToGif(selected);
  };
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
      <div style="font-size: 3em;">↓</div>
      <div><button on:click={handleClickGif}>gifに変換</button></div>
      {#if gifPromise}
        {#await gifPromise}
          <div
            style="width: 640px; height: 480px; border: #666666 dashed 2px;"
            class="center">
            gifに変換中...
          </div>
        {:then gif}
          <div
            style="display: flex; gap: 30px; border: dimgrey dotted 1px; padding: 30px">
            <div>
              <img
                src={gif.url}
                alt="result"
                style="object-fit: contain; max-height: 480px;" />
            </div>
            <div style="padding: 30px;">
              <a href={gif.url} download={gif.name}>
                <button>ダウンロード ({(gif.size / 1024).toFixed()}kb)</button>
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
