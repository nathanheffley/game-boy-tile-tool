<script setup>
import { ref } from 'vue'

const tilesetName = ref('Tileset')

const color  = ref(0)

const colors = {
    0: 'bg-[#FFF]',
    1: 'bg-[#CCC]',
    2: 'bg-[#555]',
    3: 'bg-[#000]',
}

const mapWidth = ref(8)
const mapHeight = ref(8)

const oldMapWidth = ref(8)
const oldMapHeight = ref(8)

const map = ref([
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
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

const colorPixel = (index) => {
    allSprites.value[sprite.value][index] = color.value
}

const colorMap = (index) => {
    map.value[index] = sprite.value
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
        if (i % 8 === 0 && i !== 0) {
            output += '\n    '
        }
        const hex = map.value[i].toString(16).toUpperCase()
        output += '0x' + (hex.length === 1 ? '0' : '') + hex + ','
    }

    output += '\n};'

    navigator.clipboard.writeText(output)
}

const mouseDown = ref(false)

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
});
</script>

<template>
    <div class="p-4 flex gap-4">
        <div class="w-[268px] flex flex-col items-start gap-4">
            <div class="flex gap-2">
                <div @mouseleave="() => mouseDown = false" class="w-[203px] h-[203px] grid grid-rows-[repeat(8,_24px)] grid-cols-[repeat(8,_24px)] bg-gray-200 border-2 border-gray-200 gap-px select-none">
                    <div v-for="i in 64" :class="colors[allSprites[sprite][i-1]]" @mousedown="() => {colorPixel(i-1); mouseDown = true}" @mouseup="() => mouseDown = false" @mouseover="() => mouseDown && colorPixel(i-1)"></div>
                </div>

                <div class="max-h-[203px] overflow-y-scroll flex flex-col gap-2 items-end">
                    <div v-for="(s, index) in allSprites" class="flex items-center">
                        <span>{{ index }}</span>
                        <div class="ml-1 border-2 border-gray-200">
                            <div @click="sprite = index" class="w-6 h-6 grid grid-rows-[repeat(8,_3px)] grid-cols-[repeat(8,_3px)]">
                                <div v-for="i in 64" :class="colors[s[i-1]]"></div>
                            </div>
                        </div>
                    </div>
                    <div class="border-2 border-gray-200">
                        <button @click="addSprite" class="w-6 h-6 bg-gray-300 hover:bg-gray-400">+</button>
                    </div>
                </div>
            </div>

            <div class="flex border-4 border-gray-200 bg-gray-200">
                <div @click="color = 0" :class="[color === 0 ? 'w-10 h-10 m-1' : 'w-12 h-12', 'flex items-center justify-center', colors[0]]">0</div>
                <div @click="color = 1" :class="[color === 1 ? 'w-10 h-10 m-1' : 'w-12 h-12', 'flex items-center justify-center', colors[1]]">1</div>
                <div @click="color = 2" :class="[color === 2 ? 'w-10 h-10 m-1' : 'w-12 h-12', 'flex items-center justify-center text-white', colors[2]]">2</div>
                <div @click="color = 3" :class="[color === 3 ? 'w-10 h-10 m-1' : 'w-12 h-12', 'flex items-center justify-center text-white', colors[3]]">3</div>
            </div>

            <input v-model="tilesetName" class="w-full bg-gray-200 border border-gray-200 px-4 py-2 rounded" placeholder="Tileset Name" />

            <button @click="copyToClipboard" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Copy to Clipboard</button>
        </div>
        <div class="shrink-0 w-[333px] flex flex-col gap-4">
            <div @mouseleave="() => mouseDown = false" class="w-full h-[333px] grid gap-px bg-gray-200 border-2 border-gray-200 select-none" :style="`grid-template-rows: repeat(${mapHeight}, 24px); grid-template-columns: repeat(${mapWidth}, 24px);`">
                <div v-for="i in mapWidth * mapHeight" @mousedown="() => {colorMap(i-1); mouseDown = true}" @mouseup="() => mouseDown = false" @mouseover="() => mouseDown && colorMap(i-1)">
                    <div class="w-6 h-6 grid grid-rows-[repeat(8,_3px)] grid-cols-[repeat(8,_3px)]">
                        <div v-for="p in 64" :class="colors[allSprites[map[i-1] ?? 0][p-1]]"></div>
                    </div>
                </div>
            </div>

            <div class="flex">
                Width: <input type="number" class="ml-1 mr-4 w-16" v-model="mapWidth" @change="adjustMap" />
                Height: <input type="number" class="ml-1 mr-4 w-16" v-model="mapHeight" @change="adjustMap" />
            </div>
        </div>
    </div>
</template>