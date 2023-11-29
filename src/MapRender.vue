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

const sendPaintEvent = (event) => {
    const rect = canvas.value.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / 3 / 8)
    if (x < 0 || x >= props.mapWidth) return
    const y = Math.floor((event.clientY - rect.top) / 3 / 8)
    if (y < 0 || y >= props.mapHeight) return
    const index = x + y * props.mapWidth
    if (index < 0 || index >= props.map.length) return
    emit('paint', index)
}

const canvas = ref(null)

const render = () => {
    if (!canvas.value) return

    const ctx = canvas.value.getContext('2d')
    const computedStyle = getComputedStyle(canvas.value)

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

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
    const ctx = canvas.value.getContext('2d')
    ctx.scale(3, 3)
    render()
})
</script>

<template>
    <canvas
        @mousedown="(event) => {mouseDown = true; sendPaintEvent(event)}"
        @mousemove="(event) => {if (mouseDown) sendPaintEvent(event)}"
        @mouseleave="mouseDown = false"
        @mouseup="mouseDown = false"
        class="border-2 border-gray-200 select-none w-[333px] h-[333px]"
        width="333"
        height="333"
        ref="canvas"
    ></canvas>
</template>