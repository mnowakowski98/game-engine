import startGame from './src/project/asteroids/startup'

addEventListener('load', () => {
    document.body.style.margin = '0'
    document.body.style.backgroundColor = 'black'

    const canvas = document.createElement('canvas')
    canvas.width = innerWidth
    canvas.height = innerHeight - 6
    canvas.style.backgroundColor = '#a3a3a3'
    // canvas.style.cursor = 'none'

    document.body.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    startGame(context)
})