<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | null = null
let points: THREE.Points | null = null
let animationId: number | null = null
let resizeObserver: ResizeObserver | null = null
let lastStepTime = 0
let isRunning = false
let visibilityHandler: (() => void) | null = null

let cols = 0
let rows = 0
let current: Uint8Array
let next: Uint8Array
let colors: Float32Array
let colorsCurrent: Float32Array
let colorsTarget: Float32Array

const cellSeed = 0.26
const targetRows = 60
const stepInterval = 240

const aliveColor = new THREE.Color('#ffffff')
const aliveGlow = new THREE.Color('#f0f0f0')
const deadColor = new THREE.Color('#050505')

const buildGrid = (aspect: number) => {
  rows = targetRows
  cols = Math.max(36, Math.round(rows * aspect))
  current = new Uint8Array(cols * rows)
  next = new Uint8Array(cols * rows)

  for (let i = 0; i < current.length; i += 1) {
    current[i] = Math.random() < cellSeed ? 1 : 0
  }
}

const indexOf = (x: number, y: number) => (y * cols + x)

const fillColorsFromState = (state: Uint8Array, out: Float32Array) => {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      let neighbors = 0
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          if (ox === 0 && oy === 0) continue
          const nx = (x + ox + cols) % cols
          const ny = (y + oy + rows) % rows
          neighbors += state[indexOf(nx, ny)]
        }
      }

      const idx = indexOf(x, y)
      const colorIndex = idx * 3
      const mix = neighbors / 8

      if (state[idx] === 1) {
        const blended = aliveColor.clone().lerp(aliveGlow, mix)
        out[colorIndex] = blended.r
        out[colorIndex + 1] = blended.g
        out[colorIndex + 2] = blended.b
      } else {
        const fade = 0.35 + mix * 0.25
        out[colorIndex] = deadColor.r * fade
        out[colorIndex + 1] = deadColor.g * fade
        out[colorIndex + 2] = deadColor.b * fade
      }
    }
  }
}

const step = () => {
  colorsCurrent.set(colors)

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      let neighbors = 0
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          if (ox === 0 && oy === 0) continue
          const nx = (x + ox + cols) % cols
          const ny = (y + oy + rows) % rows
          neighbors += current[indexOf(nx, ny)]
        }
      }

      const idx = indexOf(x, y)
      const alive = current[idx] === 1
      next[idx] = alive
        ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
        : (neighbors === 3 ? 1 : 0)
    }
  }

  fillColorsFromState(next, colorsTarget)

  const temp = current
  current = next
  next = temp

  lastStepTime = performance.now()
}

const buildScene = () => {
  if (!container.value) return

  const { clientWidth, clientHeight } = container.value
  const aspect = clientWidth / clientHeight
  if (!renderer || !scene || !camera || !points) {
    buildGrid(aspect)

    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-cols / 2, cols / 2, rows / 2, -rows / 2, 1, 50)
    camera.position.z = 20

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(cols * rows * 3)
    colors = new Float32Array(cols * rows * 3)
    colorsCurrent = new Float32Array(cols * rows * 3)
    colorsTarget = new Float32Array(cols * rows * 3)

    let pointer = 0
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        positions[pointer] = x - cols / 2 + 0.5
        positions[pointer + 1] = y - rows / 2 + 0.5
        positions[pointer + 2] = 0
        colors[pointer] = deadColor.r
        colors[pointer + 1] = deadColor.g
        colors[pointer + 2] = deadColor.b
        pointer += 3
      }
    }

    fillColorsFromState(current, colors)
    colorsCurrent.set(colors)
    colorsTarget.set(colors)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  renderer.setSize(clientWidth, clientHeight)
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)
}

const onResize = () => {
  if (!container.value) return
  if (renderer) {
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
}

const animate = (time = 0) => {
  if (!renderer || !scene || !camera || !points) return
  if (time - lastStepTime >= stepInterval) {
    step()
  }

  const t = Math.min(1, (time - lastStepTime) / stepInterval)
  for (let i = 0; i < colors.length; i += 1) {
    colors[i] = colorsCurrent[i] + (colorsTarget[i] - colorsCurrent[i]) * t
  }
  const geometry = points.geometry as THREE.BufferGeometry
  geometry.attributes.color.needsUpdate = true
  renderer.render(scene, camera)
  animationId = window.requestAnimationFrame(animate)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  buildScene()
  lastStepTime = performance.now()
  isRunning = true
  animate()

  if (container.value) {
    resizeObserver = new ResizeObserver(() => onResize())
    resizeObserver.observe(container.value)
  }

  visibilityHandler = () => {
    if (document.hidden) {
      if (animationId) window.cancelAnimationFrame(animationId)
      isRunning = false
      return
    }
    if (!isRunning) {
      isRunning = true
      lastStepTime = performance.now()
      animate()
    }
  }

  document.addEventListener('visibilitychange', visibilityHandler)
})

onBeforeUnmount(() => {
  if (animationId) window.cancelAnimationFrame(animationId)
  resizeObserver?.disconnect()
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  isRunning = false
})
</script>

<template>
  <div ref="container" class="home-bg" aria-hidden="true"></div>
</template>
