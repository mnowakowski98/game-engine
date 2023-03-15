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
    canvas.height = container.clientHeight - containerPadding
    canvas.style.border = '1px solid black'

    container.appendChild(canvas)

    const controlContainer = document.createElement('div')
    controlContainer.style.display = 'flex'
    controlContainer.style.justifyContent = 'center'
    container.appendChild(controlContainer)


    const speedSpliderLabel = document.createElement('label')
    speedSpliderLabel.htmlFor = 'asteroids-maxspeed'
    speedSpliderLabel.innerHTML = 'Max speed: '

    const speedSlider = document.createElement('input')
    speedSlider.type = 'range'
    speedSlider.id = 'asteroids-maxspeed'
    speedSlider.value = '10'
    speedSlider.min = '10'
    speedSlider.max = '25'

    controlContainer.appendChild(speedSpliderLabel)
    controlContainer.appendChild(speedSlider)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    start(context)
})