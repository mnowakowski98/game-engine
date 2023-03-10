import { Asteroid, renderAsteroid, checkCollision, updateAsteroid } from '../actors/asteroid'
import GameTimer, { renderGameTimer } from '../actors/game-timer'
import { addRendering, removeRendering } from '../render-loop'
import { renderShip, Ship, updateShip } from '../actors/ship'
import { addUpdatable, removeUpdatable } from '../update-loop'
import { getMousePosition } from '../inputs'

export function startGame(canvasWidth: number, canvasHeight: number) {
    let isPaused = false

    const timer: GameTimer = {
        id: "game-timer",
        time: 0,
        update: deltaTime => {
            if(!isPaused) timer.time += deltaTime
        },
        render: context => renderGameTimer(timer, context)
    }
    addUpdatable(timer)
    addRendering(timer)

    const ship: Ship = {
        id: 'ship',
        colliding: false,
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
            ship.colliding = false
            updateShip(ship)
        }
    }

    addRendering(ship)
    addUpdatable(ship)

    const asteroids: Asteroid[] = []

    const makeAsteroid = (id: string) => {
        const asteroid: Asteroid = {
            id: id,
            boundingRadius: 25,
            position: {
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight
            },
            rotation: ((Math.random() * 360) * Math.PI) / 180,
            speed: (Math.random() * 10) + 5,
            update: deltaTime => {
                if(isPaused) return

                if (asteroid.isCollidingWith(ship.position)) {
                    ship.colliding = true
                    endGame()
                }

                if ((asteroid.position.x < asteroid.boundingRadius || asteroid.position.x > canvasWidth - asteroid.boundingRadius)
                    || (asteroid.position.y < 0 || asteroid.position.y > canvasHeight - asteroid.boundingRadius)) {
                    removeUpdatable(asteroid)
                    removeRendering(asteroid)
                    asteroids.splice(asteroids.findIndex(_ => _.id === asteroid.id), 1)
                }

                return updateAsteroid(asteroid, deltaTime)
            },
            render: context => renderAsteroid(asteroid, context),
            isCollidingWith: position => checkCollision(asteroid, position)
        }

        addRendering(asteroid)
        addUpdatable(asteroid)
        return asteroid
    }

    let nextAsteroidId = 1
    const spawnTimer = setInterval(() => {
        if (asteroids.length < 20) asteroids.push(makeAsteroid(`asteroid-${nextAsteroidId++}`))
    })

    const togglePauseState = () => isPaused = !isPaused
    addEventListener('game-pause', togglePauseState)

    const endGame = () => {
        clearInterval(spawnTimer)

        removeUpdatable(timer)
        removeRendering(timer)

        removeUpdatable(ship)
        removeRendering(ship)

        for(const asteroid of asteroids) {
            removeUpdatable(asteroid)
            removeRendering(asteroid)
        }

        removeEventListener('game-pause', togglePauseState)
        
        dispatchEvent(new Event('game-end'))
    }

    dispatchEvent(new Event('game-start'))
}