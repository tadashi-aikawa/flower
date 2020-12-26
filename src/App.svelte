<script lang="ts">
  import { convertToGif } from "./converter";

  type LoadingState = "init" | "loading" | "success" | "error";

  let selected: File;
  let gif: {
    loading: LoadingState;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  } = {
    loading: "init",
  };

  export const changeFile = async (e) => {
    gif.loading = "init";
    selected = e.target.files[0];
  };
  export const handleClickGif = async () => {
    gif.loading = "loading";
    const source = await convertToGif(selected);
    gif.loading = "success";
    gif.fileUrl = source.url;
    gif.fileName = source.name;
    gif.fileSize = source.size;
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

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
      {#if gif.loading === 'init'}
        <div style="font-size: 3em;">↓</div>
        <div><button on:click={handleClickGif}>gifに変換</button></div>
      {/if}
      {#if gif.loading === 'loading'}
        <div
          style="width: 640px; height: 480px; border: #666666 dashed 2px;"
          class="center">
          gifに変換中...
        </div>
      {/if}
      {#if gif.loading === 'success'}
        <div
          style="display: flex; gap: 30px; border: dimgrey dotted 1px; padding: 30px">
          <div>
            <img
              src={gif.fileUrl}
              alt="result"
              style="object-fit: contain; max-height: 480px;" />
          </div>
          <div style="padding: 30px;">
            <a href={gif.fileUrl} download={gif.fileName}>
              <button>ダウンロード ({(gif.fileSize / 1024).toFixed()}[kb])</button>
            </a>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</main>
