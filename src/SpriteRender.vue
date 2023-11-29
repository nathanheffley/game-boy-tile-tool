<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
    sprite: Array,
})

const colors = {
    0: '--color-lightest',
    1: '--color-light',
    2: '--color-dark',
    3: '--color-darkest',
}

const canvas = ref(null)

const render = () => {
    if (!canvas.value) return

    const ctx = canvas.value.getContext('2d')
    const computedStyle = getComputedStyle(canvas.value)
    for (let i = 0; i < 64; i++) {
        const x = i % 8
        const y = Math.floor(i / 8)
        ctx.fillStyle = `rgb(${computedStyle.getPropertyValue(colors[props.sprite[i]])})`
        ctx.fillRect(x, y, 1, 1)
    }
}

watch(() => props.sprite, render, { deep: true })

onMounted(() => {
    const ctx = canvas.value.getContext('2d')
    ctx.scale(3, 3)
    render()
})
</script>

<template>
    <canvas ref="canvas" width="24" height="24"></canvas>
</template>