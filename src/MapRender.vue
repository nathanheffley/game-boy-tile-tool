<script setup>
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['paint'])

const props = defineProps({
    map: Array,
    mapWidth: Number,
    mapHeight: Number,
    sprites: Array,
})

const colors = {
    0: '--color-lightest',
    1: '--color-light',
    2: '--color-dark',
    3: '--color-darkest',
}

const mouseDown = ref(false)
const middleDown = ref(false)

const xScale = ref(3)
const yScale = ref(3)

const xOffset = ref(8)
const yOffset = ref(8)

const sendPaintEvent = (event) => {
    const rect = canvas.value.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left - xOffset.value) / xScale.value / 8)
    if (x < 0 || x >= props.mapWidth) return
    const y = Math.floor((event.clientY - rect.top - yOffset.value) / yScale.value / 8)
    if (y < 0 || y >= props.mapHeight) return
    const index = x + y * props.mapWidth
    if (index < 0 || index >= props.map.length) return
    emit('paint', index)
}

const oldMouseX = ref(null)
const oldMouseY = ref(null)

const dragView = (event) => {
    if (oldMouseX.value !== null && oldMouseY.value !== null) {
        xOffset.value += (event.clientX - oldMouseX.value)
        yOffset.value += (event.clientY - oldMouseY.value)
        render()
    }
    oldMouseX.value = event.clientX
    oldMouseY.value = event.clientY
}

const canvas = ref(null)

const render = () => {
    if (!canvas.value) return

    const ctx = canvas.value.getContext('2d')
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.transform(xScale.value, 0, 0, yScale.value, xOffset.value, yOffset.value)

    const computedStyle = getComputedStyle(canvas.value)
    for (let x = 0; x < props.mapWidth; x++) {
        for (let y = 0; y < props.mapHeight; y++) {
            const sprite = props.sprites[props.map[x + y * props.mapWidth]] ?? 0
            for (let i = 0; i < 64; i++) {
                const sx = i % 8
                const sy = Math.floor(i / 8)
                ctx.fillStyle = `rgb(${computedStyle.getPropertyValue(colors[sprite[i]])})`
                ctx.fillRect(x * 8 + sx, y * 8 + sy, 1, 1)
            }
        }
    }
}

watch(() => props.map, render, { deep: true })
watch(() => props.mapWidth, render)
watch(() => props.mapHeight, render)
watch(() => props.sprites, render, { deep: true })

onMounted(() => {
    render()
})
</script>

<template>
    <canvas
        @mousedown.left="(event) => {mouseDown = true; sendPaintEvent(event)}"
        @mouseup.left="mouseDown = false"
        @mousedown.middle="middleDown = true"
        @mouseup.middle="middleDown = false; oldMouseX = null; oldMouseY = null"
        @wheel="event => {
            if (event.deltaY > 0) {
                xScale = Math.max(1, xScale - 1)
                yScale = Math.max(1, yScale - 1)
            } else {
                xScale = Math.min(5, xScale + 1)
                yScale = Math.min(5, yScale + 1)
            }
            render()
        }"
        @mousemove="(event) => {
            if (mouseDown) { sendPaintEvent(event) }
            else if (middleDown) { dragView(event) }
        }"
        @mouseleave="mouseDown = false; middleDown = false"
        class="border-2 border-gray-200 select-none w-[333px] h-[333px]"
        width="333"
        height="333"
        ref="canvas"
    ></canvas>
</template>