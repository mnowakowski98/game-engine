import { Asteroid, renderAsteroid, checkCollision, updateAsteroid } from './src/asteroid'
import GameTimer, { renderGameTimer } from './src/game-timer'
import { addRendering, removeRendering, startRendering } from './src/render-loop'
import { renderShip, Ship, updateShip } from './src/ship'
import { addUpdatable, removeUpdatable, startUpdating, stopUpdateLoop } from './src/update-loop'

addEventListener('load', () => {
    const canvas = document.createElement('canvas')
    const canvasPadding = 100
    canvas.width = innerWidth - canvasPadding
    canvas.height = innerHeight - canvasPadding
    canvas.style.margin = `${canvasPadding / 2}px`
    canvas.style.border = '1px solid black'

    document.body.style.margin = '0'
    document.body.style.backgroundColor = '#a3a3a3'
    document.body.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    const startTime = startUpdating()
    const timer: GameTimer = {
        id: "game-timer",
        startTime: startTime,
        endTime: startTime,
        totalTime: () => timer.endTime - timer.startTime,
        update: deltaTime => {
            timer.endTime += deltaTime
            return true
        },
        render: context => renderGameTimer(timer, context)
    }
    addUpdatable(timer)
    addRendering(timer)

    let isPaused = false

    const pause = () => {
        stopUpdateLoop()
        isPaused = true
    }

    const unpause = () => {
        const timeShift = performance.now() - timer.endTime
        timer.startTime += timeShift
        timer.endTime += timeShift

        startUpdating()
        isPaused = false
    }

    const ship: Ship = {
        id: 'ship',
        colliding: false,
        position: {
            x: 50,
            y: canvas.height / 2
        },
        targetPosition: {
            x: 50,
            y: canvas.height / 2
        },
        rotation: 90,
        width: 25,
        length: 50,
        render: context => renderShip(ship, context),
        update: () => {
            ship.colliding = false
            updateShip(ship)
            return true
        }
    }

    canvas.addEventListener('mousemove', event => {
        ship.targetPosition.x = event.offsetX
        ship.targetPosition.y = event.offsetY
    })

    addRendering(ship)
    addUpdatable(ship)

    const asteroids: Asteroid[] = []

    const makeAsteroid = (id: string) => {

        const asteroid: Asteroid = {
            id: id,
            boundingRadius: 25,
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            rotation: ((Math.random() * 360) * Math.PI) / 180,
            speed: (Math.random() * 10) + 5,
            update: deltaTime => {
                if(asteroid.isCollidingWith(ship.position)) {
                    ship.colliding = true
                    pause()
                    context.save()
                    context.scale(3, 4)
                    context.fillText('You dieadeded', canvas.width / 2, canvas.height / 2)
                    context.restore()
                }
    
                if ((asteroid.position.x < asteroid.boundingRadius || asteroid.position.x > canvas.width - asteroid.boundingRadius)
                || (asteroid.position.y < 0 || asteroid.position.y > canvas.height - asteroid.boundingRadius)) {
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
    setInterval(() => {
        if(asteroids.length < 20) asteroids.push(makeAsteroid(`asteroid-${nextAsteroidId++}`))
    })

    addEventListener('keyup', event => {
        if (event.code == 'Space') {
            if(isPaused) unpause()
            else pause()
        }
    })

    startRendering(context)
})