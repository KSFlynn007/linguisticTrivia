// HTML elements select
const btn = document.querySelector('.btn');
const header = document.querySelector('header');
const h1 = document.querySelector('h1');
const subtitle = document.querySelector('.subtitle');
const output = document.querySelector('.output');


// app variables
const url = 'questionData.json';
const questions = [];
let cur = 0;
let holder = [];
let count = 0;

const clockDiv = document.querySelector('#clockdiv');
clockDiv.style.display = 'none';

const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
let mySecond = 10;
let myMinute = 0;
let timer = null;

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
window.addEventListener('DOMContentLoaded', (e) => {
    loadQuestions();
})

// doesn't link to any other functions, fills the global var questions to use within app
function loadQuestions(){
    fetch(url)
    .then(rep => rep.json())
    .then(data => {
        // console.log(data);
        data.forEach(element => {
            let temp = [];
            element.incorrect.forEach((ans) => {
                let tempObj = {
                    "response" : ans,
                    "correct" : false
                }
                temp.push(tempObj);
            })
            let tempObj = {
                "response" : element.correct,
                "correct" : true
            }
            temp.push(tempObj);
            let mainTemp = {
                "question" : element.question,
                "options" : temp
            }
            questions.push(mainTemp);
        });
        // console.log(questions);
    })
}


btn.addEventListener('click', (e) => {
    newQuestion();
    startTimer();
    btn.style.display = 'none';
    subtitle.style.display = 'none';
    clockDiv.style.display = 'block';
})


function newQuestion(){
    if(cur == questions.length){
        clockDiv.style.display = 'none';
        endGame();
    } else {
    const el = questions[cur];
    el.options.sort(() => {return 0.5 - Math.random()});

    output.innerHTML = '';
    const que1 = createNode(output, 'div', el.question);
    que1.classList.add('que');
    const ans1 = createNode(output, 'div', '');
    ans1.classList.add('ans');

    holder.length = 0;

    el.options.forEach((ans) => {
        const div = createNode(ans1, 'div', ans.response);
        div.classList.add('box');
        holder.push(div);
        div.correct = ans.correct;
        div.addEventListener('click', selOptions);
    }) 
    }
}

function selOptions(e){
    endTurn(holder);
    if(e.target.correct){
        e.target.style.backgroundColor = 'green';
        count++;
    } else {
        e.target.style.backgroundColor = 'red';
    }
}

function endTurn(holder){
    holder.forEach(el => {
        el.removeEventListener('click', selOptions);
        el.style.backgroundColor = '#ddd';
    });
    btn.style.display = 'block';
    btn.textContent = 'Next Question';
    cur++;
}

function endGame(){
    stopTimer();
    h1.innerHTML = `Game Over`
    if(count > (questions.length/2)){
        output.innerHTML = `Well done, you got ${count} out of ${questions.length} correct!`
    } else {
        output.innerHTML = `Good try, you got ${count} out of ${questions.length} correct!`
        const extraInfo = createNode(output, 'div', `Want to review some concepts? <br> Check out this <a href="https://www.ipachart.com/" target="_blank">IPA Chart</a> to learn more about phonology!`)
        extraInfo.classList.add('extraInfo')
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