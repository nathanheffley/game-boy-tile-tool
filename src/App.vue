<script setup>
import { ref } from 'vue'
import SpriteRender from './SpriteRender.vue';

const tilesetName = ref('Tileset')

const tool = ref('pencil')

const palette = ref('bw')

const color  = ref(0)

const colors = {
    0: 'bg-lightest',
    1: 'bg-light',
    2: 'bg-dark',
    3: 'bg-darkest',
}

const mapWidth = ref(12)
const mapHeight = ref(12)

const oldMapWidth = ref(12)
const oldMapHeight = ref(12)

const map = ref([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])

const allSprites = ref([
    [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ],
])

const sprite = ref(0)

const addSprite = () => {
    allSprites.value.push([
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ])
    sprite.value = allSprites.value.length - 1
}

const fillPixel = (index, oldColor, newColor) => {
    if (allSprites.value[sprite.value][index] === oldColor) {
        allSprites.value[sprite.value][index] = color.value
        if (index % 8 !== 0) {
            fillPixel(index - 1, oldColor)
        }
        if (index % 8 !== 7) {
            fillPixel(index + 1, oldColor)
        }
        if (index > 7) {
            fillPixel(index - 8, oldColor)
        }
        if (index < 56) {
            fillPixel(index + 8, oldColor)
        }
    }
}

const colorPixel = (index) => {
    if (tool.value === 'pencil') {
        allSprites.value[sprite.value][index] = color.value
    }

    if (tool.value === 'fill') {
        const oldColor = allSprites.value[sprite.value][index]
        if (oldColor !== color.value) {
            fillPixel(index, oldColor)
        }
    }
}

const fillMap = (index, oldTile) => {
    if (map.value[index] === oldTile) {
        map.value[index] = sprite.value
        if (index % mapWidth.value !== 0) {
            fillMap(index - 1, oldTile)
        }
        if (index % mapWidth.value !== mapWidth.value - 1) {
            fillMap(index + 1, oldTile)
        }
        if (index > mapWidth.value - 1) {
            fillMap(index - mapWidth.value, oldTile)
        }
        if (index < mapWidth.value * (mapHeight.value - 1)) {
            fillMap(index + mapWidth.value, oldTile)
        }
    }
}

const colorMap = (index) => {
    if (tool.value === 'pencil') {
        map.value[index] = sprite.value
    }

    if (tool.value === 'fill') {
        const oldTile = map.value[index]
        if (oldTile !== sprite.value) {
            fillMap(index, oldTile)
        }
    }
}

const adjustMap = () => {
    const newMap = map.value

    if (mapHeight.value > oldMapHeight.value) {
        // Add rows to bottom
        const valuesToAppend = (mapHeight.value - oldMapHeight.value) * mapWidth.value
        for (let i = 0; i < valuesToAppend; i++) {
            newMap.push(0)
        }
    } else if (mapHeight.value < oldMapHeight.value) {
        // Remove rows from bottom
        const valuesToRemove = (oldMapHeight.value - mapHeight.value) * mapWidth.value
        newMap.splice(newMap.length - valuesToRemove, valuesToRemove)
    }

    if (mapWidth.value > oldMapWidth.value) {
        // Add columns to end of each row
        const valuesToAppend = mapWidth.value - oldMapWidth.value
        for (let i = 0; i < mapHeight.value; i++) {
            for (let j = 0; j < valuesToAppend; j++) {
                newMap.splice((i+1)*mapWidth.value-1, 0, 0)
            }
        }
    } else if (mapWidth.value < oldMapWidth.value) {
        // Remove columns from end of each row
        const valuesToRemove = oldMapWidth.value - mapWidth.value
        for (let i = 0; i < mapHeight.value; i++) {
            newMap.splice((i+1) * mapWidth.value, valuesToRemove)
        }
    }

    map.value = newMap

    oldMapWidth.value = mapWidth.value
    oldMapHeight.value = mapHeight.value
}

const copyToClipboard = () => {
    let output = 'unsigned char ' + tilesetName.value + 'Tiles[] =\n{\n    '

    const hexes = []

    for (let index in allSprites.value) {
        for (let i = 0; i < 8; i++) {
            const lsb = []
            const msb = []
            const pixels = allSprites.value[index].slice(i*8, i*8+8)
            pixels.forEach(pixel => {
                if (pixel === 0) {
                    lsb.push(0)
                    msb.push(0)
                }
                if (pixel === 1) {
                    lsb.push(1)
                    msb.push(0)
                }
                if (pixel === 2) {
                    lsb.push(0)
                    msb.push(1)
                }
                if (pixel === 3) {
                    lsb.push(1)
                    msb.push(1)
                }
            })
            let lsbHex = parseInt(lsb.join(''), 2).toString(16).toUpperCase()
            lsbHex = (lsbHex.length === 1 ? '0x0' : '0x') + lsbHex
            let msbHex = parseInt(msb.join(''), 2).toString(16).toUpperCase()
            msbHex = (msbHex.length === 1 ? '0x0' : '0x') + msbHex
            hexes.push(lsbHex)
            hexes.push(msbHex)
        }
    }

    for (let i = 0; i < hexes.length; i++) {
        if (i % 16 === 0 && i !== 0) {
            output += '\n    '
        }
        output += hexes[i] + ','
    }

    output += '\n};\n\nunsigned char ' + tilesetName.value + 'Map[] =\n{\n    '

    for (let i = 0; i < map.value.length; i++) {
        if (i % mapWidth.value === 0 && i !== 0) {
            output += '\n    '
        }
        const hex = map.value[i].toString(16).toUpperCase()
        output += '0x' + (hex.length === 1 ? '0' : '') + hex + ','
    }

    output += '\n};'

    navigator.clipboard.writeText(output)
}

const mouseDown = ref(false)

window.api.receive("togglePalette", () => {
    const r = document.querySelector(':root')
    if (palette.value === 'bw') {
        palette.value = 'dmg'
        r.style.setProperty('--color-lightest', '224 248 208')
        r.style.setProperty('--color-light', '136 192 112')
        r.style.setProperty('--color-dark', '52 104 86')
        r.style.setProperty('--color-darkest', '8 24 32')
    } else {
        palette.value = 'bw'
        r.style.setProperty('--color-lightest', '255 255 255')
        r.style.setProperty('--color-light', '204 204 204')
        r.style.setProperty('--color-dark', '85 85 85')
        r.style.setProperty('--color-darkest', '0 0 0')
    }
})

window.api.receive("spritesLoaded", (data) => {
    allSprites.value = []
    if (data.sprites.length === 0) {
        addSprite()
    } else {
        allSprites.value = data.sprites
    }
    sprite.value = 0

    if (data.name) {
        tilesetName.value = data.name
    }

    if (data.mapWidth) {
        mapWidth.value = data.mapWidth
        oldMapWidth.value = data.mapWidth
    }

    if (data.mapHeight) {
        mapHeight.value = data.mapHeight
        oldMapHeight.value = data.mapHeight
    }

    if (data.map) {
        map.value = data.map
    }
});
</script>

<template>
    <div class="p-4 flex gap-4" :key="palette">
        <div class="w-[268px] flex flex-col items-start gap-4">
            <div class="flex gap-2">
                <div @mouseleave="() => mouseDown = false" class="w-[203px] h-[203px] grid grid-rows-[repeat(8,_24px)] grid-cols-[repeat(8,_24px)] bg-gray-200 border-2 border-gray-200 gap-px select-none">
                    <div
                        v-for="i in 64"
                        :class="colors[allSprites[sprite][i-1]]"
                        @mousedown="() => {colorPixel(i-1); mouseDown = true}"
                        @mouseup="() => mouseDown = false"
                        @mouseover="() => mouseDown && colorPixel(i-1)"
                    ></div>
                </div>

                <div class="max-h-[203px] overflow-y-scroll flex flex-col gap-2 items-end">
                    <div v-for="(s, index) in allSprites" class="flex items-center">
                        <span>{{ index }}</span>
                        <div :class="['ml-1 border-2', index === sprite ? 'border-blue-500' : 'border-gray-200']">
                            <div @click="sprite = index">
                                <SpriteRender :sprite="s" />
                            </div>
                        </div>
                    </div>
                    <div class="border-2 border-gray-200">
                        <button @click="addSprite" class="w-6 h-6 bg-gray-300 hover:bg-gray-400">+</button>
                    </div>
                </div>
            </div>

            <div class="flex items-center">
                <div class="flex border-4 border-gray-200 bg-gray-200">
                    <div @click="color = 0" :class="[color === 0 ? 'border-4 border-blue-500' : '', 'w-12 h-12 flex items-center justify-center', colors[0]]">0</div>
                    <div @click="color = 1" :class="[color === 1 ? 'border-4 border-blue-500' : '', 'w-12 h-12 flex items-center justify-center', colors[1]]">1</div>
                    <div @click="color = 2" :class="[color === 2 ? 'border-4 border-blue-500' : '', 'w-12 h-12 flex items-center justify-center text-white', colors[2]]">2</div>
                    <div @click="color = 3" :class="[color === 3 ? 'border-4 border-blue-500' : '', 'w-12 h-12 flex items-center justify-center text-white', colors[3]]">3</div>
                </div>

                <button @click="tool='pencil'" :class="['ml-2 p-1', tool === 'pencil' ? 'text-blue-700 bg-blue-100 rounded' : 'text-gray-700']">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" class="w-5 h-5">
                        <path d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448H64c-17.7 0-32 14.3-32 32s14.3 32 32 32H208c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z"/>
                    </svg>
                </button>

                <button @click="tool = 'fill'" :class="['ml-1 p-1', tool === 'fill' ? 'text-blue-700 bg-blue-100 rounded' : 'text-gray-700']">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" class="w-5 h-5">
                        <path d="M41.4 9.4C53.9-3.1 74.1-3.1 86.6 9.4L168 90.7l53.1-53.1c28.1-28.1 73.7-28.1 101.8 0L474.3 189.1c28.1 28.1 28.1 73.7 0 101.8L283.9 481.4c-37.5 37.5-98.3 37.5-135.8 0L30.6 363.9c-37.5-37.5-37.5-98.3 0-135.8L122.7 136 41.4 54.6c-12.5-12.5-12.5-32.8 0-45.3zm176 221.3L168 181.3 75.9 273.4c-4.2 4.2-7 9.3-8.4 14.6H386.7l42.3-42.3c3.1-3.1 3.1-8.2 0-11.3L277.7 82.9c-3.1-3.1-8.2-3.1-11.3 0L213.3 136l49.4 49.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0zM512 512c-35.3 0-64-28.7-64-64c0-25.2 32.6-79.6 51.2-108.7c6-9.4 19.5-9.4 25.5 0C543.4 368.4 576 422.8 576 448c0 35.3-28.7 64-64 64z"/>
                    </svg>
                </button>
            </div>

            <input v-model="tilesetName" class="w-full bg-gray-200 border border-gray-200 px-4 py-2 rounded" placeholder="Tileset Name" />

            <button @click="copyToClipboard" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Copy to Clipboard</button>
        </div>
        <div class="shrink-0 w-[333px] flex flex-col gap-4">
            <div @mouseleave="() => mouseDown = false" class="w-full h-[333px] overflow-scroll grid gap-px bg-gray-200 border-2 border-gray-200 select-none" :style="`grid-template-rows: repeat(${mapHeight}, 24px); grid-template-columns: repeat(${mapWidth}, 24px);`">
                <div v-for="i in mapWidth * mapHeight" @mousedown="() => {colorMap(i-1); mouseDown = true}" @mouseup="() => mouseDown = false" @mouseover="() => mouseDown && colorMap(i-1)">
                    <SpriteRender :sprite="allSprites[map[i-1] ?? 0]" />
                </div>
            </div>

            <div class="flex">
                Width: <input type="number" class="ml-1 mr-4 w-16" v-model="mapWidth" @change="adjustMap" />
                Height: <input type="number" class="ml-1 mr-4 w-16" v-model="mapHeight" @change="adjustMap" />
            </div>
        </div>
    </div>
</template>