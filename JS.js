const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".conntrols-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
const items = [{name: 'dog1', image: 'img/dog/dog1.webp'},
{name: 'dog2', image: 'img/dog/dog2.png'},
{name: 'dog3', image: 'img/dog/dog3.webp'},
{name: 'dog4', image: 'img/dog/dog4.jpg'},
{name: 'dog5', image: 'img/dog/dog5.jpeg'},
{name: 'dog6', image: 'img/dog/dog6.jpeg'},];

let seconds = 0, minutes = 0;

let moveCount = 0, winCount = 0;

const timeGenerator = () => {
    seconds += 1;
    if(seconds >= 60){
        minutes += 1;
        seconds = 0;
    }
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span> ${minutesValue}:${secondsValue}`;
};

const moveCounter = () => {
    moveCount += 1;
    moves.innerHTML = `<span>Moves:</span>${moveCount}`
};


const generateRandom = (size = 4) => {
    let tempArr = [...items];
    let cardValues = [];
    size = (size * size) / 2;
    for(let i = 0; i < size; i++){
        const randomIndex = Math.floor(Math.random() * tempArr.length);
        cardValues.push(tempArr[randomIndex]);
        tempArr.slice(randomIndex, 1);

    }
    return cardValues;

};

const generateDeck = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random - 0.5);
    for(let i = 0; i < size*size; i++){
        gameContainer.innerHTML += `<div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div clas="card-after">
            <img src="${cardValues[i].image}" class="image" height=50 width=50 /></div>
        </div>`;
        
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if(!card.classList.contains("matched")){
                card.classList.add("flipped");
                if(!firstCard){
                    firstCard = card;
                    let firstCardValue = card.getAttribute("data-card-value");
                }
            }
            else{
                moveCounter();
                secondCard = card;
                let secondCardValue = card.getAttribute("data-card-value");
                if(firstCardValue == secondCardValue){
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    firstCard = false;
                    winCount += 1;
                    if(winCount == Math.floor(cardValues.length / 2)){
                        result.innerHTML = `<h2>You Won!</h2>
                        <h4>Moves: ${moveCount}</h4>`;
                        stopGame();

                    }
                } else{
                    let [tempFirst, tempSecond] = [firstCard, secondCard];
                    firstCard = false;
                    secondCard = false;
                    let delay = setTimeout(() => {
                        tempFirst.classList.remove("flipped");
                        tempSecond.classList.remove("flipped");
                    }, 900)
                }
            }
        });
    });
    

};

startButton.addEventListener("click", () => {
    moveCount = 0;
    time = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves: </span>${moveCount}`;
    initializer();

} );

const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    generateDeck(cardValues);
}; 

stopButton.addEventListener("click", (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);

}))
