import { addRendering, startRendering } from './src/render-loop'
import Ship from './src/ship'
import { addUpdatable, startUpdating } from './src/update-loop'

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

    const ship = new Ship(Math.random() * 1000)
    canvas.addEventListener('mousemove', event => ship.setPosition(event.offsetX, event.offsetY))
    addRendering(ship)
    addUpdatable(ship)

    startUpdating()
    startRendering(context)
})