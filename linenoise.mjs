import readline from 'node:readline'
import crypto from 'node:crypto'
import { EventEmitter } from 'node:events'

const rl = readline.promises.createInterface(process.stdin, process.stdout)
const commonEE = new EventEmitter({captureRejections:true})
const linenoise = {sentence: '', cursor:0}

commonEE.on('send_msg', stdoutHandler)
commonEE.on('recv_msg', stdoutHandler)

// user receiving messages (emulated)
const timeoutInterval = setInterval(function () {
    const msg = 'friend: '+crypto.randomUUID()
    commonEE.emit('recv_msg', msg)
}, getRandMs())

// user sending messages
while (true) {
    const msg = await rl.question('you: ')
    if (msg == '/exit') {
        cleanup()
        break
    }
    //commonEE.emit('send_msg', 'you: '+msg)
    // otherwise things get unduly complicated!
}

function getRandMs() {
    const max = 3, min = 1
    const number = Math.floor(Math.random() * (max - min + 1)) + min
    return number * 1000
}

function stdoutHandler(data) {
    linenoise.sentence = rl.line
    linenoise.cursor = rl.cursor
    process.stdout.clearLine()
    process.stdout.clearScreenDown()
    process.stdout.cursorTo(0)
    rl.pause()
    process.stdout.write(data+'\r\n')
    process.stdout.write('you: ')

    rl.line =''
    rl.cursor=0
    rl.resume()
    rl.write(linenoise.sentence)
}

function cleanup() {
    commonEE.removeAllListeners()
    rl.close()
    clearInterval(timeoutInterval)
}