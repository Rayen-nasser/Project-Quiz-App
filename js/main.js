let file = prompt("choose type of test: - lifeOfMohamed - Quran - IslamikOnGeneral ")

let title = document.querySelector('.Category');
let numberOfQuestion = document.querySelector('.numberOfQuestion');
let question = document.querySelector('.question');
let choose = document.querySelector('.choose');
let btn = document.querySelector('.btn');
let time = document.querySelector('.time')
let currentIndex = 0;
let countDownIntervel ;
let duration = 5
function counDown(count , duration){
    if(count > currentIndex){
        let minutes, seconds
        countDownIntervel = setInterval(function(){
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}`:minutes
            seconds = seconds < 10 ? `0${seconds}`:seconds

            time.innerHTML = `${minutes}:${seconds}`

            if(--duration < 0){
                clearInterval(countDownIntervel)
                btn.click()
            }
        },1000)
    }
}

function addQuestion(obj) {
  question.innerHTML = obj.title;
  for (let i = 1; i < 5; i++) {
    let item = `<li class="list-group-item">
            <div class="form-check text-end">
              <input
                class="form-check-input"
                type="checkbox"
                name="question"
                value="${obj[`answer_${i}`]}"
                id="answer_${i}"/>
              <label class="form-check-label" for="answer_${i}">
                ${obj[`answer_${i}`]}
              </label>
            </div>
          </li>`;

    choose.innerHTML += item;
  }
}

function createSpan() {
  let span = document.createElement('span');
  span.setAttribute('class', 'on');
  document.querySelector('.spans').appendChild(span);
}

function checkAnswer(currentIndex,rightAn,nbQuestion){
    let trueAnswer = 0
    let falseAnswer = 0
    let TabOfA = []
    let answer = document.getElementsByName("question")
    for (let index = 0; index < answer.length; index++) {
        if(answer[index].checked === true){
            TabOfA.push(answer[index]) 
        }
    }
    for (let index = 0; index < TabOfA.length; index++) {
        for(let j = 0 ; j < rightAn.length ; j++){
            if(TabOfA[index].value == rightAn[j]){
                trueAnswer++
            }else{
                falseAnswer++
            }
        }
    }
    if(currentIndex   <= nbQuestion){
        createSpan()
        let currentSpan = document.querySelector('.on')
        if(trueAnswer > 0   && trueAnswer < rightAn.length && falseAnswer > 0){
            currentSpan.classList.toggle("few")
        }else if(trueAnswer === rightAn.length ){
            currentSpan.classList.toggle("sucess")
        } else{
            currentSpan.classList.toggle("bed")
        }
        currentSpan.classList.remove("on")
        currentIndex++
    }
}

function showResult(count) {
  if (currentIndex === count) {;
    btn.remove();
    question.remove();
    choose.remove();
    time.remove()
    let correctAnswer = document.querySelectorAll('.sucess').length;
    let imperfectAnswer = document.querySelectorAll('.few').length;
    let result = correctAnswer + imperfectAnswer * 0.5;
    let div = document.createElement('div');
    div.setAttribute('dir', 'rtl');
    div.setAttribute('lang', 'ar');

    if (result < count / 2) {
      var text = document.createTextNode(
        `رسبة بالامتحان: ${result} من ${count} حاول مرة أخرى`
      );
    } else if (count / 1.5 < result && result < count / 2) {
      var text = document.createTextNode(
        `أحسنت يا أخي: ${result} من ${count}`
      );
    } else {
      var text = document.createTextNode(
        `ممتاز أخي: ${result} من ${count}`
      );
    }
    div.appendChild(text);
    document.querySelector('.card-body').appendChild(div);
  }
}

fetch(`../data/${file}.json`)
  .then((data) => {
    if (data.ok) {
      return data.json();
    } else {
      throw new Error('Error fetching data');
    }
  })
  .then((dt) => {
    numberOfQuestion.innerHTML = 'Number Of Questions: ' + dt.length;
    title.innerHTML = 'Category: '+ file;
    for (let i = 1; i <= dt.length; i++) {
      createSpan();
    }
    return dt;
  })
  .then((dt) => {
    let nbrandom = Math.floor(Math.random() * dt.length)
    if (nbrandom < dt.length) {
      obj = dt[nbrandom];
      addQuestion(obj);
      return dt;
    }
  })
  .then((dt) => {
    counDown(dt.length,duration)
    btn.addEventListener('click', function () {
    let spans = document.querySelector('.spans')
    spans.removeChild(spans.lastElementChild)
      let rightAnswer = dt[currentIndex].right_answer;
      checkAnswer(currentIndex,rightAnswer, dt.length);
      currentIndex++;
      question.innerHTML = '';
      choose.innerHTML = '';
      if (currentIndex < dt.length) {
        addQuestion(dt[currentIndex]);
      }
      clearInterval(countDownIntervel)
      counDown(dt.length,duration)
      showResult(dt.length);
    });
  })
  .catch((error) => {
    console.error(error);
  });
