<script setup>
import { ref } from 'vue'

const props = defineProps({
    sprite: Array,
})

const colors = {
    0: 'bg-lightest',
    1: 'bg-light',
    2: 'bg-dark',
    3: 'bg-darkest',
}
</script>

<template>
    <div class="w-6 h-6 grid grid-rows-[repeat(8,_3px)] grid-cols-[repeat(8,_3px)]">
        <div v-for="p in 64" :class="colors[sprite[p-1]]"></div>
    </div>
</template>