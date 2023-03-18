import { start } from './src/startup'

addEventListener('load', () => {
    document.body.style.margin = '0'
    document.body.style.backgroundColor = '#a3a3a3'

    const canvas = document.createElement('canvas')
    
    canvas.style.boxSizing = 'border-box'
    canvas.width = innerWidth - 6
    canvas.height = innerHeight - 6
    canvas.style.border = '3px dashed black'

    document.body.appendChild(canvas)
    
    const context = canvas.getContext('2d')
    if(context == null) {
        console.error('Context was null')
        return
    }

    start(context)
})