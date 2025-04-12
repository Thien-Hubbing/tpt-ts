<script lang="ts">
export default {
  data() {
    return {};
  },
  methods: {
    nodeShown() {},
  },
};
</script>

<template>
  <button
    v-if="nodeShown(layer)"
    :id="layer"
    :tooltip="
      tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
      : (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
    "
    :class="{
      treeButton: size != 'small',
      smallNode: size == 'small',
      [layer]: true,
      ghost: tmp[layer].layerShown == 'ghost',
      hidden: !tmp[layer].layerShown,
      locked: !tmp[layer].canClick,
      notify: tmp[layer].notify,
      can: tmp[layer].canClick,
      anim: (player.anim&&!player.oldStyle),
      grad: (player.grad&&!player.oldStyle)
    }"
    :style="[tmp[layer].canClick ? {'background-color': tmp[layer].color} : {}, tmp[layer].nodeStyle]"
    :html="abb"
    @click="function() {
      layers[layer].onClick()
    }"
  />
</template>

<style>

</style>
