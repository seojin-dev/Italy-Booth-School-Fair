let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
let quizStarted = false;

function startExploration() {
  document.getElementById("startScreen").style.display = "none";
  showSlide(0);
  updateProgress();
}

function showSlide(n) {
  if (quizStarted) return;

  slides.forEach((slide) => slide.classList.remove("active"));
  currentSlide = n;
  slides[currentSlide].classList.add("active");
  updateProgress();
  updateNavigationButtons();
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    showSlide(currentSlide + 1);
  } else {
    startQuiz();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

function updateProgress() {
  const progress = document.getElementById("progress");
  const percentage = ((currentSlide + 1) / totalSlides) * 100;
  progress.style.width = `${percentage}%`;
}

function updateNavigationButtons() {
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");

  if (prevButton && nextButton) {
    prevButton.style.visibility = currentSlide === 0 ? "hidden" : "visible";
    nextButton.textContent =
      currentSlide === totalSlides - 1 ? "퀴즈 시작" : "다음 →";
  }
}

function startQuiz() {
  quizStarted = true;
  document.querySelector(".slide.active").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  document.querySelector(".progress-bar").style.display = "none";
}

const quizAnswers = {
  1: true, // 카니발 문제
  2: false, // 트룰리 문제
  3: true, // 피자 문제
  4: true, // 베네치아 가면 문제
  5: false, // 파스타 문제
};

let score = 0;
const answeredQuestions = new Set();

function checkAnswer(questionNum, userAnswer) {
  if (answeredQuestions.has(questionNum)) return;

  const resultDiv = document.getElementById(`answer${questionNum}`);
  const isCorrect = userAnswer === quizAnswers[questionNum];

  resultDiv.className = `result-message ${isCorrect ? "correct" : "incorrect"}`;
  resultDiv.textContent = isCorrect
    ? "정답입니다! 잘 알고 계시네요!"
    : "아쉽네요, 다시 한번 생각해보세요!";

  if (isCorrect) score++;
  answeredQuestions.add(questionNum);

  if (answeredQuestions.size === Object.keys(quizAnswers).length) {
    showFinalScore();
  }
}

function showFinalScore() {
  const totalQuestions = Object.keys(quizAnswers).length;
  const scoreDiv = document.createElement("div");
  scoreDiv.className = "final-score";
  scoreDiv.innerHTML = `
        <h3>퀴즈 완료!</h3>
        <p>총 ${totalQuestions}문제 중 ${score}문제를 맞추셨습니다.</p>
        <button class="button" onclick="goHome()">다시 시작하기</button>
    `;
  document.getElementById("quiz").appendChild(scoreDiv);
}

function goHome() {
  location.reload();
}

// 키보드 네비게이션
document.addEventListener("keydown", function (event) {
  if (quizStarted) return;

  switch (event.key) {
    case "ArrowLeft":
      prevSlide();
      break;
    case "ArrowRight":
      nextSlide();
      break;
  }
});

// 터치 이벤트 처리
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", function (event) {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", function (event) {
  if (quizStarted) return;

  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const difference = touchStartX - touchEndX;

  if (Math.abs(difference) < swipeThreshold) return;

  if (difference > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
}
