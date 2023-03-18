import { start } from './src/startup'

addEventListener('load', () => {
    document.body.style.margin = '0'
    document.body.style.backgroundColor = '#a3a3a3'

    const container = document.createElement('div')
    const containerPadding = 100
    container.style.width = `${innerWidth - containerPadding}px`
    container.style.height = `${innerHeight - containerPadding}px`
    container.style.margin = `${containerPadding / 2}px`
    container.style.border = '1px solid blue'
    document.body.appendChild(container)

    const canvas = document.createElement('canvas')
    
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
    canvas.style.border = '1px solid black'

    container.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    start(context)
})