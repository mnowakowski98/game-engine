import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering, removeRendering } from '../render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable, removeUpdatable } from '../update-loop'
import { getMousePosition } from '../inputs'
import { AsteroidSpawner, spawnAsteroid } from '../actors/asteroid-spawner'
import { Asteroid } from '../actors/asteroid'

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
        removeUpdatable(timer)
        removeRendering(timer)

        removeUpdatable(ship)
        removeRendering(ship)

        removeUpdatable(asteroidSpawner)

        removeEventListener('game-pause', togglePauseState)
        
        dispatchEvent(new Event('game-end'))
    }

    let nextAsteroidId = 0
    let numAsteroids = 0
    let lastAsteroidSpawnTime = 0
    const asteroidSpawner: AsteroidSpawner = {
        id: 'asteroid-spawner',
        maxSpeed: 5,
        minSpeed: 3,
        maxRadius: 10,
        minRadius: 5,
        checkCollisionsWith: ship,
        onAsteroidCollision: endGame,
        onAsteroidDespawn: () => numAsteroids--,
        update: () => {
            if (isPaused) return
            if (performance.now() - lastAsteroidSpawnTime < 750) return
            if (numAsteroids > 10) return

            spawnAsteroid(asteroidSpawner, `asteroid-${nextAsteroidId++}`, canvasWidth, canvasHeight, () => isPaused)
            numAsteroids++
            lastAsteroidSpawnTime = performance.now()
        }
    }
    addUpdatable(asteroidSpawner)

    dispatchEvent(new Event('game-start'))
}