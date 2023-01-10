const moves = document.getElementById("moves-count");
const playerCont = document.getElementById("player-cont");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".conntrols-container");
const players = document.querySelectorAll(".player-bar button");
const sizes = document.querySelectorAll(".field-bar button");
const images = document.querySelectorAll(".icon-bar .card-container");
const menu = document.querySelector(".menu");
const nextButton = document.getElementById("next");
let activePlayers;
let activeSize;
let activeImage;

players.forEach((player) => {
    player.addEventListener("click", () => {

        if(activePlayers){
            
            activePlayers.classList.remove("active-button");
            activePlayers = player;
            activePlayers.classList.add("active-button");
        }
        else{
            activePlayers = player;
            activePlayers.classList.add("active-button");
        }

    })
    
});

sizes.forEach((size) => {
    size.addEventListener("click", () => {

        if(activeSize){
            
            activeSize.classList.remove("active-button");
            activeSize = size;
            activeSize.classList.add("active-button");
        }
        else{
            activeSize = size;
            activeSize.classList.add("active-button");
        }

    })
    
});

images.forEach((image) => {

    image.addEventListener("click", () => {
        if(activeImage){
            activeImage.classList.remove("flipped");
            activeImage = image;
            activeImage.classList.add("flipped");
        }
        else{
            activeImage = image;
            activeImage.classList.add("flipped");
        }
    });



});


let cards;
let interval;
let firstCard = false;
let secondCard = false;
let turnPlayer = 0;

const itemsDog = [{name: 'dog1', image: 'img/dog/dog1_preview_rev_1.png'},
{name: 'dog2', image: 'img/dog/dog2_preview_rev_1.png'},
{name: 'dog3', image: 'img/dog/dog3_preview_rev_1.png'},
{name: 'dog4', image: 'img/dog/dog4_preview_rev_1.png'},
{name: 'dog5', image: 'img/dog/dog5_preview_rev_1.png'},
{name: 'dog6', image: 'img/dog/dog6_preview_rev_1.png'},];
const itemsCat = [{name: 'cat1', image: 'img/cat/cat1-removebg-preview.png'},
{name: 'cat2', image: 'img/cat/cat2-removebg-preview.png'},
{name: 'cat3', image: 'img/cat/cat3-removebg-preview.png'},
{name: 'cat4', image: 'img/cat/cat4-removebg-preview.png'},
{name: 'cat5', image: 'img/cat/cat5-removebg-preview.png'},
{name: 'cat6', image: 'img/cat/cat6-removebg-preview.png'}];
const itemsDino = [{name: 'dino1', image: 'img/dino/dino1-removebg-preview.png'},
{name: 'dino2', image: 'img/dino/dino2-removebg-preview.png'},
{name: 'dino3', image: 'img/dino/dino3-removebg-preview.png'},
{name: 'dino4', image: 'img/dino/dino4-removebg-preview.png'},
{name: 'dino5', image: 'img/dino/dino5-removebg-preview.png'},
{name: 'dino6', image: 'img/dino/dino6-removebg-preview.png'}];


let realPlayers = [{name: "1st Player", score: 0}];

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

const changeTurn = (index) => {
    playerCont.innerHTML = `<span>${realPlayers[index].name} (${realPlayers[index].score})`;
};

const increaseCount = (index) => {
    realPlayers[index].score += 50;
    playerCont.innerHTML = `<span>${realPlayers[index].name} (${realPlayers[index].score})`;
};

const findWinner = (array) => {
    let result;
    let max = 0;
    for(let i = 0; i < array.length; i++){
        if(array[i].score > max){
            max = array[i].score;
            result = array[i];
        };
    };
    return result;
};



const generateRandom = (items, wid , len) => {
    let tempArr = [...items];
    let cardValues = [];
    let size;
    size = (wid * len) / 2;
    for(let i = 0; i < size; i++){
        const randomIndex = Math.floor(Math.random() * tempArr.length);
        cardValues.push(tempArr[randomIndex]);
        tempArr.slice(randomIndex, 1);

    }
    return cardValues;

};

const generateDeck = (cardValues, wid, len) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random - 0.5);
    for(let i = 0; i < wid*len; i++){
        gameContainer.innerHTML += `<div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after">
            <img src="${cardValues[i].image}" class="image" height=64 width=64 /></div>
        </div>`;
        
    }
    gameContainer.style.gridTemplateColumns = `repeat(${len},auto)`;

    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        let delay = setTimeout(() => {
            card.classList.add("flipped");
        }, 100);

        delay = setTimeout(() => {
            card.classList.remove("flipped");
        }, 1100);
    });
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if(!card.classList.contains("matched")){
                card.classList.add("flipped");
                if(!firstCard){
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
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
                    increaseCount(turnPlayer);
                    if(winCount == Math.floor(cardValues.length / 2)){
                        let winner = findWinner(realPlayers);
                        
                        result.innerHTML = `<h2>${winner.name} Won!</h2>
                            <h3>Score: ${winner.score}</h3>
                        <h4>Moves: ${moveCount}</h4>`;

                        stopGame();

                    }
                } else{
                    let [tempFirst, tempSecond] = [firstCard, secondCard];
                    firstCard = false;
                    secondCard = false;
                    delay = setTimeout(() => {
                        tempFirst.classList.remove("flipped");
                        tempSecond.classList.remove("flipped");
                    }, 900);
                    turnPlayer++;
                    if(realPlayers.length === turnPlayer){
                        turnPlayer = 0;
                    }
                    changeTurn(turnPlayer);
                }
            }
        }
        });
    });
    

};

startButton.addEventListener("click", () => {
    moveCount = 0;
    time = 0;
    initializer();
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves: </span>${moveCount}`;
    playerCont.innerHTML = `<span>${realPlayers[turnPlayer].name} (${realPlayers[turnPlayer].score})`;
    

} );

const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues;
    let widh;
    let leng;
    if(activePlayers.getAttribute("value") === "2" && realPlayers.length < 2){
        realPlayers.push({name: "2nd Player", score: 0});
    }
    else if(activePlayers.getAttribute("value") === "3" && realPlayers.length < 3){
        realPlayers.push({name: "2nd Player", score: 0});
        realPlayers.push({name: "3rd Player", score: 0});
    }
    else if(activePlayers.getAttribute("value") === "4" && realPlayers.length < 4){
        realPlayers.push({name: "2nd Player", score: 0});
        realPlayers.push({name: "3rd Player", score: 0});
        realPlayers.push({name: "4th Player", score: 0});
    }
    if(activeSize.getAttribute("name") === "3x4"){
        widh = 4;
        leng = 3;
    }
    else if(activeSize.getAttribute("name") === "4x4"){
        widh = 4;
        leng = 4;
    }
    else{
        widh = 4;
        leng = 5;
    }
    

    if(activeImage.getAttribute("data-card-value") === "dog"){
        cardValues = generateRandom(itemsDog, widh, leng);
    }
    else if(activeImage.getAttribute("data-card-value") === "cat"){
        cardValues = generateRandom(itemsCat, widh, leng);
    }
    else{
        cardValues = generateRandom(itemsDino, widh, leng);
    }
    for(let i = 0; i < realPlayers.length; ++i){
        realPlayers[i].score = 0;
    }
    
    
    if(realPlayers.length > parseInt(activePlayers.getAttribute("value"))){
        while(realPlayers.length != parseInt(activePlayers.getAttribute("value"))){
            realPlayers.pop();
            
        }
    }

    if(cardValues.length < 1){
        return;
    }

    

    generateDeck(cardValues, widh, leng);
    
}; 

stopButton.addEventListener("click", (stopGame = () => {
    for(let i = 0; i < realPlayers.length; ++i){
        realPlayers[i].score = 0;
    }
    turnPlayer = 0;
    controls.classList.remove("hide");
    menu.classList.add("hide");
    stopButton.classList.add("hide");
    nextButton.classList.remove("hide");
    nextButton.addEventListener("click", () => {
        menu.classList.remove("hide");
        startButton.classList.remove("hide");
        activeImage.classList.add("flipped");
        result.innerHTML = "";
        nextButton.classList.add("hide");
    });
    clearInterval(interval);

}));



