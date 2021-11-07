const btn = document.querySelector('.btn');
const h1 = document.querySelector('h1');
const output = document.querySelector('.output');

const url = 'questionData.json';
const questions = [];
let cur = 0;
let holder = [];

btn.addEventListener('click', (e) => {
    newQuestion();
    btn.style.display = 'none';
})

window.addEventListener('DOMContentLoaded', (e) => {
    loadQuestions();
})

function createNode(parent, eleType, html){
    let temp = document.createElement(eleType);
    temp.innerHTML = html;
    parent.append(temp);

    return temp;
}

function newQuestion(){
    //console.log(questions[cur]);
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
        // console.log(ans.response);
        holder.push(div);
        div.correct = ans.correct;
        div.addEventListener('click', selOptions);
    })
}

function selOptions(e){
    endTurn(holder);
    console.log(e.target);
    if(e.target.correct){
        e.target.style.backgroundColor = 'green';
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
        console.log(questions);
    })
}

