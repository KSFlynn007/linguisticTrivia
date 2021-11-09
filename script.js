// HTML elements select
const btn = document.querySelector('.btn');
const header = document.querySelector('header');
const h1 = document.querySelector('h1');
const subtitle = document.querySelector('.subtitle');
const output = document.querySelector('.output');

// app variables
const url = 'questionData.json';
const game = {
    que: [],
    question: 0,
    eles: [],
    count: 0
}

const clockDiv = document.querySelector('#clockdiv');
clockDiv.style.display = 'none';

const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
let mySecond = 0;
let myMinute = 15;
let timer = null;

const liveMinutes = document.getElementById("minutes").textContent;
const liveSeconds = document.getElementById("seconds").textContent;
let total = `${liveMinutes}:${liveSeconds}`;

function startTimer(){
    mySecond < 10 
        ?(seconds.innerHTML = "0" + mySecond)
        :(seconds.innerHTML = mySecond);
    myMinute < 10 
        ?(minutes.innerHTML = "0" + myMinute)
        :(minutes.innerHTML = myMinute);
    timer = setInterval(() => {
        if(mySecond == 0){
            mySecond = 60;
            if(myMinute != 0){
                myMinute < 10
                    ?(minutes.innerHTML = '0' + --myMinute)
                    :(minutes.innerHTML = --myMinute);
            } else {
                clearInterval(timer);
                clockDiv.style.display = 'none';
                endGame();
            }
        }
        mySecond <= 10
            ?(seconds.innerHTML = "0" + --mySecond)
            :(seconds.innerHTML = --mySecond);
    }, 1000);
}

function stopTimer(){
    clearInterval(timer);
    mySecond = 0;
    myMinute = 0;
}

// APP START
btn.addEventListener('click', (e) => {
    startTimer();
    btn.style.display = 'none';
    subtitle.style.display = 'none';
    clockDiv.style.display = 'block';
    
    fetch(url).then(res => res.json())
    .then((data) => {
        console.log(data);
        game.que = data;
        outputPage();
    })
})

function outputPage(){
    if(game.question >= game.que.length){
        endGame();
    } else {
        output.innerHTML = ''
        output.classList.add('activeOutput');

        let question = (game.que[game.question]);
        game.question++;

        let answers = question.incorrect;
        console.log(answers)

        let randomIndex = Math.floor(Math.random() * (answers.length +1));
        answers.splice(randomIndex, 0, question.correct);

        const mainDiv = createNode(output, 'div', '');
        const que1 = createNode(mainDiv, 'div', question.question);
        game.eles.length = 0;

        const optsDiv = createNode(output, 'div', '');
        optsDiv.classList.add('optsDiv');
        const resultsDiv = createNode(output, 'div', '');

        const nextDiv = createNode(output, 'div', '');
        nextDiv.style.display = 'none';
        nextDiv.classList.add('nextDiv');

        answers.forEach(opt => {
            const opt1 = createNode(optsDiv, 'button', opt);
            game.eles.push(opt1);

            if(opt == question.correct){
                opt1.bgC = '#72AC72';
            } else {
                opt1.bgC = '#E96D6D'
            }
            opt1.addEventListener('click', (e) => {
                game.eles.forEach((btnv) => {
                    btnv.disabled = true;
                    btnv.style.backgroundColor = btnv.bgC;
                })
                resultsDiv.style.display = 'block';
                
                const message = createNode(resultsDiv, 'div', ``);
                if(opt == question.correct){
                    game.count++;
                    message.textContent = 'You got it right!';
                } else {
                    message.textContent = `Oops, the correct answer was "${question.correct}". `
                    console.log(question.factoid)
                    if(question.factoid != ''){
                        message.textContent += question.factoid
                    }
                }
                nextDiv.style.display = 'flex';
                nextQue(nextDiv);
            })
        })
    }
}

function nextQue(parent){
    const nextBtn = createNode(parent, 'button', 'Next Question');
    nextBtn.addEventListener('click', outputPage);
}

function endGame(){
    stopTimer();

    if(clockDiv.style.display != 'none'){
        clockDiv.style.display = 'none';
    }

    h1.innerHTML = `/geɪm ˈəʊvə/`;
    subtitle.style.display = 'block';
    subtitle.innerHTML = `Your remaining time was ${total} minutes.`

    if(game.count > (game.que.length/2)){
        output.innerHTML = `Well done, you got ${game.count} out of ${game.que.length} questions correct!`
    } else {
        output.innerHTML = `Good try, you got ${game.count} out of ${game.que.length} questions correct!`
    }

    // in case user times out before moving to a new question
    if(btn.style.display = 'block'){
        btn.style.display = 'none'
    }

    const playAgain = createNode(output, 'button', 'Play Again?');
    playAgain.classList.add('playAgainBtn');

    playAgain.addEventListener('click', (e) => {
        location.reload()
    })
}


function createNode(parent, eleType, html){
    let temp = document.createElement(eleType);
    temp.innerHTML = html;
    parent.append(temp);

    return temp;
}