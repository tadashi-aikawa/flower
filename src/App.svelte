<script lang="ts">
  import "smelte/src/tailwind.css";
  import { convertToFavicon, convertToGif, convertToMp4 } from "./converter";
  import type { BinaryFile, ConvertHandler } from "./converter";
  import { List, ListItem, NavigationDrawer } from "smelte";
  import ConvertBox from "./ConvertBox.svelte";

  let selected: File;
  let promise: Promise<BinaryFile>;

  const menu: {
    name: string;
    text: string;
    convertHandler?: ConvertHandler;
  }[] = [
    { name: "gif", text: "gifに変換", convertHandler: convertToGif },
    {
      name: "favicon",
      text: "faviconに変換",
      convertHandler: convertToFavicon,
    },
    { name: "mp4", text: "mp4に変換", convertHandler: convertToMp4 },
  ];
  let currentName = "top";
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
  <NavigationDrawer elevation>
    <h6 class="p-6 ml-1 pb-2 text-xs text-gray-900">Menu</h6>
    <List items={menu}>
      <span slot="item" let:item class="cursor-pointer">
        <ListItem
          selected={currentName.includes(item.name)}
          {...item}
          dense
          on:click={() => (currentName = item.name)}
          navigation />
      </span>
    </List>
    <hr />
  </NavigationDrawer>

  <div>
    <h1>Flower</h1>
    {#each menu as item}
      {#if item.name === currentName}
        <ConvertBox title={item.text} convertHandler={item.convertHandler} />
      {/if}
    {/each}
  </div>
</main>
