import startGame from './src/project/test/composer'

addEventListener('load', () => {
    document.body.style.margin = '0'
    document.body.style.backgroundColor = 'black'

    const canvas = document.createElement('canvas')
    canvas.style.backgroundColor = '#a3a3a3'
    // canvas.style.cursor = 'none'

    const setCanvasSize = () => {
        canvas.width = innerWidth
        canvas.height = innerHeight - 6
    }

    addEventListener('resize', setCanvasSize)
    setCanvasSize()

    document.body.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    startGame(context)
})