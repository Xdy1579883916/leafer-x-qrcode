<script setup lang="ts">
import {onMounted} from 'vue'
import '@leafer-in/editor'
import '@leafer-in/text-editor'
import '@leafer-in/export'
import '@leafer-in/view'
import '@leafer-in/viewport'
import {App, Debug, Group} from "leafer-ui";
import "@lx/qrcode"
import {QRCode} from "@lx/qrcode"

let leaferApp: App
Debug.filter = ['leafer-x-qrcode']
Debug.enable = true
// console.log(UICreator.list);

async function initLeafer() {

  leaferApp = new App({
    view: 'leafer-app',
    width: 1200,
    height: 600,
    editor: {
      editSize: 'size',
      point: {
        editConfig: {editSize: 'font-size'},
      }
    },
  })
  leaferApp.tree.add([
    new QRCode({
      "tag": "QRCode",
      "width": 200,
      "height": 200,
      "text": "ABC",
      "iconSrc": 'data:image/png;base64,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',
      "x": 100,
      "y": 100,
      "editable": true,
    }),
    new QRCode({
      "tag": "QRCode",
      "width": 200,
      "height": 200,
      "text": "ABC",
      "iconSrc": 'data:image/png;base64,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',
      "x": 320,
      "y": 100,
      "editable": true,
    }),
    new QRCode({
      text: 'Hello World',
      color: 'linear-gradient(90deg, rgb(48, 34, 238) 0%, rgb(143, 20, 128) 54%, rgb(236, 7, 19) 100%)',
      iconSrc: 'https://cn.vuejs.org/logo.svg',
      width: 100,
      height: 100,
      x: 100,
      y: 320,
      editable: true,
    })
  ])

  ;(window as any).app = leaferApp
}

onMounted(() => {
  initLeafer()
})

function handleExport() {
  leaferApp.tree.export("test.png")
}

function getUIs(): QRCode[] {
  return leaferApp.tree.children as QRCode[]
}

function handleExport2() {
  const group = new Group()
  const uis = getUIs()
  uis.forEach(v => {
    v.clone().dropTo(group)
  })
  group.export("test.png")
}


function handleExport3() {
  console.log(getUIs().map(v => v.toJSON()))
}
function handleDebug() {
  Debug.enable = !Debug.enable
  Debug.showBounds = Debug.enable ? 'hit' : false
}
</script>

<template>
  <NFlex justify="start">
    <div id="leafer-app" style="background: rgb(242 235 255);"></div>
    <NFlex vertical>
      <h3>window.app 可获取leafer 实例, 自行操作</h3>
      <NFlex justify="start">
        <NButton @click="handleDebug"> Debug </NButton>
        <NButton @click="handleExport">导出图片</NButton>
        <NButton @click="handleExport2">导出图片2</NButton>
        <NButton @click="handleExport3">导出JSON（见console）</NButton>
      </NFlex>
    </NFlex>
  </NFlex>
</template>
