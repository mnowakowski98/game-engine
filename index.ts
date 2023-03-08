import { Asteroid, renderAsteroid, checkCollision, updateAsteroid } from './src/asteroid'
import { addRendering, removeRendering, startRendering } from './src/render-loop'
import { renderShip, Ship } from './src/ship'
import { addUpdatable, removeUpdatable, startUpdating } from './src/update-loop'

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

    const ship: Ship = {
        id: 0,
        colliding: false,
        position: {
            x: 50,
            y: canvas.height / 2
        },
        rotation: 90,
        width: 25,
        length: 50,
        render: context => renderShip(ship, context),
        update: () => ship.colliding = false
    }

    canvas.addEventListener('mousemove', event => {
        ship.position.x = event.offsetX
        ship.position.y = event.offsetY
    })

    addRendering(ship)
    addUpdatable(ship)

    const asteroids: Asteroid[] = []

    const makeAsteroid = (id: number) => {

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
                if(asteroid.isCollidingWith(ship.position)) ship.colliding = true
    
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
        if(asteroids.length < 20) asteroids.push(makeAsteroid(nextAsteroidId++))
    })

    startUpdating()
    startRendering(context)
})