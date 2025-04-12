<script lang="ts">
export default {
  data(vm) {
    return {};
  },
};
</script>

<template>
  <div class="upgRow">
    <div v-for="tab in Object.keys(data)">
      <button
        v-if="data[tab].unlocked == undefined || data[tab].unlocked"
        :class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
        :style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px ' + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
        @click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<style>
.upgRow {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}
</style>
