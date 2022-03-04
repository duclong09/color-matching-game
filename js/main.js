import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
    getColorElementList,
    getColorListElement,
    getInActiveColorList,
    getPlayAgainButton,
} from './selectors.js'
import {
    createTimer,
    getRandomColorPairs,
    hidePlayAgainButton,
    setBackgroundColor,
    setTimerText,
    showPlayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTomerFinish,
})

function handleTimerChange(second) {
    //show timer text
    const fullSecond = `0${second}`.slice(-2)
    setTimerText(fullSecond)
}

function handleTomerFinish() {
    //end game:
    gameStatus = GAME_STATUS.FINISHED
    setTimerText('Game 😰ver!')
    showPlayAgainButton()
}


// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement) {
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
    const isClicked = liElement.classList.contains('active')
    if (!liElement || isClicked || shouldBlockClick) return
    //console.log(liElement)
    liElement.classList.add('active')
    //save click cell to selections
    selections.push(liElement)
    //console.log('cell click', selections)
    if (selections.length < 2) return
    //check match
    const firstColor = selections[0].dataset.color
    const secondColor = selections[1].dataset.color
    const isMatch = firstColor === secondColor
    if (isMatch) {
        setBackgroundColor(firstColor)
        //check win
        const isWin = getInActiveColorList().length === 0
        if (isWin) {
            //show replay
            //show you win
            console.log('win')
            showPlayAgainButton()
            //show you win
            setTimerText('YOU WIN! 🎉🎉')
            timer.clear()
            gameStatus = GAME_STATUS.FINISHED
        }
        selections = []
        return
    }
    //in case of not match
    gameStatus = GAME_STATUS.BLOCKING
    //remove active class for 2 liElement
    setTimeout(() => {
        //console.log('timeout run')
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')

        //reset selection
        selections = []
        if (gameStatus !== GAME_STATUS.FINISHED) {
            gameStatus = GAME_STATUS.PLAYING
        }
    }, 500)
}

function initColors() {
    //random 8 pairs of color
    const colorList = getRandomColorPairs(PAIRS_COUNT)
    //bind to li > div.overlay
    const liList = getColorElementList()
    liList.forEach((liElement, index) => {
        liElement.dataset.color = colorList[index]
        const overlayElement = liElement.querySelector('.overlay')
        if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
    })
}

function attachEvenforColorList() {
    const ulElement = getColorListElement()
    if (!ulElement) return
    //event delegation
    ulElement.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') return
        handleColorClick(event.target)
    })
}

function resetGame() {
    //reset global vars
    gameStatus = GAME_STATUS.PLAYING
    //reset dom element
    selections = []
    //remove ative class from li
    const colorElementList = getColorElementList()
    colorElementList.forEach((colorElement, index) => {
        colorElement.classList.remove('active')
    })

    //hide replay button
    hidePlayAgainButton()
    //clear you win / timeout text
    setTimerText('')
    //re-generate new color
    initColors()
    //reset background color
    setBackgroundColor('goldenrod')
    //start a new game
    startTimer()
}

function attachEventForPlayAgainButton() {
    const playAgainButton = getPlayAgainButton()
    if (!playAgainButton) return
    playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
    timer.start()
}

; (() => {
    initColors()
    attachEvenforColorList()
    attachEventForPlayAgainButton()
    startTimer()
})()
