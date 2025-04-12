<script lang="ts">
export default {
  name: "LayerTab",
  computed: {
    tabFormat() {
      return
    }
  }
}
</script>

<template>
  <div
    :style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"
    class="noBackground"
  >
    <div v-if="back">
      <button
        :class="back == 'big' ? 'other-back' : 'back'"
        @click="goBack(layer)"
      >
        ←
      </button>
    </div>
    <div v-if="!tmp[layer].tabFormat">
      <div
        v-if="spacing"
        :key="$vnode.key + '-spacing'"
        :style="{'height': spacing}"
      />
      <infobox
        v-if="tmp[layer].infoboxes"
        :key="$vnode.key + '-info'"
        :layer="layer"
        :data="Object.keys(tmp[layer].infoboxes)[0]"
      />
      <main-display
        :style="tmp[layer].componentStyles['main-display']"
        :layer="layer"
      />
      <div v-if="tmp[layer].type !== 'none'">
        <prestige-button
          :style="tmp[layer].componentStyles['prestige-button']"
          :layer="layer"
        />
      </div>
      <resource-display
        :style="tmp[layer].componentStyles['resource-display']"
        :layer="layer"
      />
      <milestones
        :style="tmp[layer].componentStyles.milestones"
        :layer="layer"
      />
      <div v-if="Array.isArray(tmp[layer].midsection)">
        <column
          :key="$vnode.key + '-mid'"
          :layer="layer"
          :data="tmp[layer].midsection"
        />
      </div>
      <clickables
        :style="tmp[layer].componentStyles['clickables']"
        :layer="layer"
      />
      <buyables
        :style="tmp[layer].componentStyles.buyables"
        :layer="layer"
      />
      <upgrades
        :style="tmp[layer].componentStyles['upgrades']"
        :layer="layer"
      />
      <challenges
        :style="tmp[layer].componentStyles['challenges']"
        :layer="layer"
      />
      <achievements
        :style="tmp[layer].componentStyles.achievements"
        :layer="layer"
      />
      <br><br>
    </div>
    <div v-if="tmp[layer].tabFormat">
      <div v-if="Array.isArray(tmp[layer].tabFormat)">
        <div
          v-if="spacing"
          :style="{'height': spacing}"
        />
        <column
          :key="$vnode.key + '-col'"
          :layer="layer"
          :data="tmp[layer].tabFormat"
        />
      </div>
      <div v-else>
        <div
          class="upgTable"
          :style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}"
        >
          <tab-buttons
            :style="tmp[layer].componentStyles['tab-buttons']"
            :layer="layer"
            :data="tmp[layer].tabFormat"
            :name="'mainTabs'"
          />
        </div>
        <layer-tab
          v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer"
          :key="$vnode.key + '-' + layer"
          :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer"
          :embedded="true"
        />
        <column
          v-else
          :key="$vnode.key + '-col'"
          :layer="layer"
          :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content"
        />
      </div>
    </div>
  </div>
</template>

<style>
</style>
