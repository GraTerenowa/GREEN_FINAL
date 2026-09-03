/*
  DIAMENTOWY TESTAMENT
  --------------------
  CHANGE ONLY:
  1. NEXT_PART_CODE
  2. Answers in QUESTS
  3. answerType: "text" or "number"
*/

const NEXT_PART_CODE = "0309";

// Each GitHub Pages path gets its own saved progress.
const STORAGE_KEY = "diamentowy-testament-" + window.location.pathname;

const QUESTS = [
  { answerType: "number",   answers: ["7641"] },   // Quest 1
  { answerType: "text", answers: ["San diego"] },   // Quest 2
  { answerType: "text,numer,text",   answers: ["piłka, 47, Tim","ball, 47, Tim","cupcake, 60, Tim","babeczka, 60, Tim","młotek, 36, Tim","hammer, 36, Tim","pierścionek, 37, Tim","ring, 37, Tim","kwiatek, 58, Tim","flower, 58, Tim","pierścionek, 7, Nick","ring, 7, Nick","pierścionek, 42, Tim","ring, 42, Tim","kwiatek, 65, Tim","flower, 65, Tim","samochód, 60, Tim","auto, 60, Tim","car, 60, Tim","kwiatek, 4, Tim","flower, 4, Tim","aparat, 33, Tim","camera, 33, Tim","aparat, 62, Tim","camera, 62, Tim"] },   // Quest 3
  { answerType: "number", answers: ["1023"] },   // Quest 4
  { answerType: "number",   answers: ["2133"] },   // Quest 5
  { answerType: "text", answers: ["Las vegas"] }    // Quest 6
];

const questsContainer = document.querySelector("#quests");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const finalModal = document.querySelector("#finalModal");
const finalCode = document.querySelector("#finalCode");

const normalize = (value) => value
  .trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, " ");

function loadSolved() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data.slice(0, QUESTS.length) : [];
  } catch {
    return [];
  }
}

let solved = loadSolved();

while (solved.length < QUESTS.length) {
  solved.push(false);
}

function saveSolved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solved));
}

function showFinalCode() {
  finalCode.textContent = NEXT_PART_CODE;
  finalModal.hidden = false;
  document.body.classList.add("modal-open");
}

function updateProgress(showPopup = false) {
  const count = solved.filter(Boolean).length;

  progressText.textContent = `${count} / ${QUESTS.length}`;
  progressBar.style.width = `${(count / QUESTS.length) * 100}%`;

  if (count === QUESTS.length) {
    finalCode.textContent = NEXT_PART_CODE;

    if (showPopup) {
      showFinalCode();
    }
  }
}

function renderQuests() {
  questsContainer.innerHTML = "";

  QUESTS.forEach((quest, index) => {
    const card = document.createElement("article");

    card.className =
      `quest-card${solved[index] ? " solved" : ""}`;

    card.innerHTML = `
      <h2 class="quest-title">Quest ${index + 1}</h2>

      <p class="answer-type">
        Answer type: ${quest.answerType}
      </p>

      <div class="answer-row">
        <input
          class="answer-input"
          type="text"
          autocomplete="off"
          placeholder="Enter ${quest.answerType} answer..."
          aria-label="Answer to Quest ${index + 1}"
          ${solved[index] ? "disabled value='COMPLETED'" : ""}
        />

        <button
          class="check-btn"
          type="button"
          ${solved[index] ? "disabled" : ""}
        >
          ${solved[index] ? "Completed" : "Check answer"}
        </button>
      </div>

      <div
        class="feedback ${solved[index] ? "ok" : ""}"
        aria-live="polite"
      >
        ${solved[index] ? "✓ Correct answer." : ""}
      </div>
    `;

    const input = card.querySelector(".answer-input");
    const button = card.querySelector(".check-btn");
    const feedback = card.querySelector(".feedback");

    function checkAnswer() {
      if (solved[index]) return;

      const value = normalize(input.value);

      const isCorrect = quest.answers.some(
        answer => normalize(String(answer)) === value
      );

      if (!value) {
        feedback.textContent = "Enter an answer first.";
        feedback.className = "feedback no";
        return;
      }

      if (isCorrect) {
        solved[index] = true;

        saveSolved();

        card.classList.add("solved");

        input.value = "COMPLETED";
        input.disabled = true;

        button.textContent = "Completed";
        button.disabled = true;

        feedback.textContent = "✓ Correct answer.";
        feedback.className = "feedback ok";

        updateProgress(true);
      } else {
        feedback.textContent = "Incorrect answer. Try again.";
        feedback.className = "feedback no";

        input.select();
      }
    }

    button.addEventListener("click", checkAnswer);

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        checkAnswer();
      }
    });

    questsContainer.appendChild(card);
  });
}

renderQuests();
updateProgress(false);

if (solved.every(Boolean)) {
  showFinalCode();
}
