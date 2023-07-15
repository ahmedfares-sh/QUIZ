const prgressArea = document.getElementById("progress");
const bulletArea = document.getElementById("bulletArea");
const numOfQuestions = document.getElementById("count");
const questionArea = document.querySelector(".quiz_area");
const answersArea = document.querySelector(".answerArea");
const submit = document.getElementById("submit");
const buttons = document.querySelectorAll('[ name="question"]');
const progDescription = document.querySelector(".disc");
const clock = document.querySelector(".timer");
let currentQuestion = 0;
let right = 0;
let wrong = 0;
function getData() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let myData = JSON.parse(this.responseText);
      let myDataCount = myData.length;
      createBullets(myDataCount);
      showQuestion(myData[currentQuestion]);
      showProgress(currentQuestion);

      submit.onclick = () => {
        if (currentQuestion < myDataCount) {
          checkAnswer(myData[currentQuestion]);

          showQuestion(myData[currentQuestion]);
          showProgress(currentQuestion);
          if (currentQuestion === 10) {
            showResult(myDataCount);
          }
        }
      };
    }
  };
  request.open("GET", "questions.json", true);
  request.send();
}

getData();
//progress spans determining the current question
function createBullets(count) {
  for (let i = 0; i < count; i++) {
    let span = document.createElement("span");
    bulletArea.appendChild(span);
  }
  numOfQuestions.innerText = count;
}

//function that show the questions and answers in the dom
function showQuestion(questions) {
  if (currentQuestion < 10) {
    questionArea.innerHTML = ` <h2>${questions["title"]}</h2>`;
    answersArea.innerHTML = ` `;
    for (let i = 1; i <= 4; i++) {
      let container = document.createElement("div");
      container.className = "awnser";

      let radioBullet = document.createElement("input");
      radioBullet.type = "radio";
      radioBullet.name = "question";
      radioBullet.id = "answer_" + i;
      if (i === 1) {
        radioBullet.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = radioBullet.id;
      label.innerText = questions[radioBullet.id];

      container.append(radioBullet, label);
      answersArea.appendChild(container);
    }
    timer();
  }
}
//right answer checker
function checkAnswer(obj) {
  if (document.querySelector(":checked") === null) return;
  let userAnswerKey = document.querySelector(":checked").id;
  if (obj[userAnswerKey] === obj["answer"]) {
    right++;
  } else {
    wrong++;
  }
  currentQuestion++;
}

//discrbes your progress depending on which question you are currently in

function showProgress(count) {
  if (currentQuestion >= 10) return;
  for (let i = 0; i <= count; i++) {
    bulletArea.children[i].classList.add("active");
  }
  if (count <= 3) {
    progDescription.innerHTML = `<span style="color:red">Not Enough</span> You Answered ${count} Questions`;
  } else if (count > 3 && count < 7) {
    progDescription.innerHTML = `<span style="color:#007bff">Mid</span> You Answered ${count} Questions`;
  } else if (count <= 9) {
    progDescription.innerHTML = `<span style="color:green">Good!</span> You Answered ${count} Questions`;
  } else if (count === 10) {
    progDescription.innerHTML = `<span style="color:green">Perfect!</span> You Answered ${count} Questions`;
  }
}
// removes question and answer area from the dom
function showResult(count) {
  questionArea.remove();
  answersArea.remove();
  submit.remove();
  prgressArea.remove();
  if (right < count / 2) {
    progDescription.innerHTML = `<span style="color:red">Faild!</span> You Answered ${right}   right  Questions`;
  } else if (right > wrong) {
    progDescription.innerHTML = `<span style="color:green">Passed!</span> You Answered ${right} right Questions`;
  }
}
// creates a timer for each question on its own
function timer() {
  let timeCount = 30;
  const time = setInterval(() => {
    timeCount--;
    clock.innerText = timeCount + "s";
    if (timeCount <= 5) {
      clock.style.color = "red";
    } else {
      clock.style.color = "#111";
    }
    if (timeCount == 0) {
      submit.click();
      clearInterval(time);
    }
  }, 1000);
}
