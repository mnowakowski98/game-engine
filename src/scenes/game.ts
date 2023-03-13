import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering } from '../engine/render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable } from '../engine/update-loop'
import { getMousePosition } from '../inputs'
import { AsteroidSpawner, spawnAsteroid } from '../actors/asteroid-spawner'

export function startGame(canvasWidth: number, canvasHeight: number) {
    let isPaused = false

    const timer: GameTimer = {
        id: "game-timer",
        time: 0,
        position: {
            x: 10,
            y: 10
        },
        update: deltaTime => {
            if(!isPaused) timer.time += deltaTime
        },
        render: context => renderGameTimer(timer, context)
    }
    addUpdatable(timer)
    addRendering(timer)

    const ship: Ship = {
        id: 'ship',
        position: {
            x: 50,
            y: canvasHeight / 2
        },
        targetPosition: {
            x: 50,
            y: canvasHeight / 2
        },
        rotation: 90,
        width: 25,
        length: 50,
        render: context => renderShip(ship, context),
        update: () => {
            if(isPaused) return
            ship.targetPosition = getMousePosition()
            updateShip(ship)
        }
    }

    addRendering(ship)
    addUpdatable(ship)

    const togglePauseState = () => isPaused = !isPaused
    addEventListener('game-pause', togglePauseState)

    const endGame = () => {
        isPaused = true
        removeEventListener('game-pause', togglePauseState)
        dispatchEvent(new Event('game-end'))
    }

    let nextAsteroidId = 0
    let numAsteroids = 0
    let lastAsteroidSpawnTime = 0

    const speedInput = document.querySelector('#asteroids-maxspeed') as HTMLInputElement
    if (!speedInput) return

    const asteroidSpawner: AsteroidSpawner = {
        id: 'asteroid-spawner',
        maxSpeed: 10,
        minSpeed: 0,
        maxRadius: 10,
        minRadius: 5,
        checkCollisionsWith: ship,
        onAsteroidCollision: endGame,
        onAsteroidDespawn: () => numAsteroids--,
        update: () => {
            if (isPaused) return
            if (performance.now() - lastAsteroidSpawnTime < 750) return
            if (numAsteroids > 10) return

            asteroidSpawner.maxSpeed = speedInput.valueAsNumber

            spawnAsteroid(asteroidSpawner, `${nextAsteroidId++}`, canvasWidth, canvasHeight, () => isPaused)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
        }
    }
    addUpdatable(asteroidSpawner)

    dispatchEvent(new Event('game-start'))
}