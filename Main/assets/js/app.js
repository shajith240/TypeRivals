import { initTest, resetTestWordsAndLetters, testLetters, testConfig } from "./test.js";

const typingTest = document.querySelector(".typing-test");
const testContainer = document.querySelector(".test");
const testText = document.querySelector(".test-text");
const userInput = document.getElementById("userInput");
const testInfo = document.querySelector(".time-word-info");
const testResult = document.querySelector(".test-results");
const testConfiguration = document.querySelector(".test-config");
const startingTextContainer = document.querySelector(".starting-text");
const textOverlay = document.querySelector(".overlay");
const wordPerMinuteContainer = document.querySelector(".wpm");
const accContainer = document.querySelector(".acc");
const testTypeResultInfo = document.querySelector(".test-type");
const timeInfoContainer = document.querySelector(".time");
const startBtn = document.getElementById("startBtn");

let currentIndex = 0;
let userInputLetters = [];
let wrongLetters = [];
let timer;
let startDuration, endDuration, duration;
let numberOfWords = 0;
let allowUserInput = true;
let testStarted = false;

startBtn.addEventListener("click", () => {
  if (!testStarted) {
    typingTest.click();
  }

  testStarted = true;
  allowUserInput = true;
});

typingTest.addEventListener("click", () => {
  fetchTypingText(); // Fetch the typing text when the test starts
  initTestWithFocus();
  setUpUserInput();
  setDuration();
  testStarted = true;
  allowUserInput = true;
});

userInput.addEventListener("blur", () => allowUserInput && userInput.focus());

userInput.addEventListener("input", startTest);

async function fetchTypingText() {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
  const outputElement = document.querySelector(".test-text");

  try {
    console.log("Fetching typing text...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: "Generate text for typing practice",
        max_output_tokens: 512
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(`API error: ${errorData.error.message}`);
    }

    const data = await response.json();
    console.log("API response data:", data);
    outputElement.textContent = data.choices[0].message.content.trim();

    // Initialize the test with the fetched text
    initTest(outputElement.textContent);

  } catch (error) {
    console.error("Error fetching typing text:", error);
    outputElement.textContent = "Error loading text. Please try again.";
  }
}

function initTestWithFocus() {
  console.log("Initializing test with focus...");
  initTest();
  startingTextContainer.classList.add("hide"); // Hide the starting text container
  textOverlay.classList.add("hide"); // Hide the overlay text
  userInput.focus(); // Focus on the input field
}

function setUpUserInput() {
  userInput.focus();

  if (testLetters && testLetters.length > 0) {
    testLetters[currentIndex].classList.add("cursor");
  }

  if (testConfig["test-by"] === "words") {
    updateNumberOfWords();
    testInfo.innerHTML = `${numberOfWords} / ${testConfig["time-word-config"]}`;
  } else {
    setTimer(testConfig["time-word-config"]);
  }
}

function startTest() {
  if (currentIndex < testLetters.length - 1) {
    handleUserInput(this);
    updateNumberOfWords();

    if (testConfig["test-by"] === "words") {
      testInfo.innerHTML = `${numberOfWords} / ${testConfig["time-word-config"]}`;
    }
  } else {
    clearInterval(timer);
    showResult();
  }

  handleCursor();
}

function handleUserInput(input) {
  userInputLetters = input.value.split("");

  const userCurrentLetter = userInputLetters[currentIndex];
  const testCurrentLetter = testLetters[currentIndex].textContent;

  if (userCurrentLetter !== undefined) {
    if (userCurrentLetter === testCurrentLetter) {
      correctLetter();
    } else {
      wrongLetter();
    }
    currentIndex++;
  } else {
    currentIndex--;
    testLetters[currentIndex].className = "letter";
  }
}

function correctLetter() {
  if (!wrongLetters.includes(testLetters[currentIndex].id)) {
    testLetters[currentIndex].classList.add("correct");
  } else {
    if (testLetters[currentIndex].textContent !== " ") {
      testLetters[currentIndex].classList.add("updated");
    } else {
      testLetters[currentIndex].classList.add("updated-space");
    }
  }
}

function wrongLetter() {
  if (testLetters[currentIndex].textContent !== " ") {
    if (!wrongLetters.includes(testLetters[currentIndex])) {
      testLetters[currentIndex].classList.add("wrong");
    } else {
      testLetters[currentIndex].classList.add("updated");
    }
  } else {
    testLetters[currentIndex].classList.add("wrong-space");
  }

  wrongLetters.push(testLetters[currentIndex].id);
}

function handleCursor() {
  testLetters.forEach((elm) => elm.classList.remove("cursor"));
  testLetters[currentIndex]?.classList.add("cursor");
}

function updateNumberOfWords() {
  const currentWordNumber = testLetters[currentIndex].parentNode.id;
  numberOfWords = parseInt(currentWordNumber) - 1;
}

function setDuration() {
  startDuration = Date.now();
}

function stopDuration() {
  endDuration = Date.now();
  duration = parseInt((endDuration - startDuration) / 1000);
}

function showResult() {
  stopDuration();

  const [WPM, accuracy] = calculateUserTestResult();
  const [minutes, seconds] = handleMinutesAndSeconds(duration);

  wordPerMinuteContainer.innerHTML = WPM;
  accContainer.innerHTML = `${accuracy}%`;
  timeInfoContainer.innerHTML = `${minutes}:${seconds}`;

  createTestTypeInfo();
  reInitTest();
  testResult.classList.add("show");
}

function calculateUserTestResult() {
  const avgEnglishWordLength = 5;
  const numberOfWrongWords = wrongLetters.length / avgEnglishWordLength;
  const numberOfCorrectWords = numberOfWords - Math.ceil(numberOfWrongWords);
  const acc = Math.floor((numberOfCorrectWords / numberOfWords) * 100);
  const wpm = Math.floor(numberOfCorrectWords / (duration / 60));

  const WPM = wpm >= 0 ? wpm : 0;
  const accuracy = acc >= 0 ? acc : 0;

  return [WPM, accuracy];
}

function createTestTypeInfo() {
  testTypeResultInfo.innerHTML = "";

  const testBySpan = document.createElement("span");
  testBySpan.innerHTML = `test by ${testConfig["test-by"]}`;
  testTypeResultInfo.appendChild(testBySpan);

  testConfig["include-to-test"].forEach((elm) => {
    const span = document.createElement("span");
    span.innerHTML = `include ${elm}`;
    testTypeResultInfo.appendChild(span);
  });

  if (testConfig["test-by"] === "words") {
    const numberOfWordsSpan = document.createElement("span");
    numberOfWordsSpan.innerHTML = `test of ${testConfig["time-word-config"]} words`;
    testTypeResultInfo.appendChild(numberOfWordsSpan);
  } else {
    const testTime = document.createElement("span");
    testTime.innerHTML = `chosen time ${testConfig["time-word-config"]}s`;
    testTypeResultInfo.appendChild(testTime);
  }
}

function setTimer(seconds) {
  timer = setInterval(() => {
    let [numberOfMinutes, numberOfSeconds] = handleMinutesAndSeconds(seconds);
    testInfo.innerHTML = `${numberOfMinutes}:${numberOfSeconds}`;

    if (--seconds < 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

function handleMinutesAndSeconds(numberOfSeconds) {
  let minutes = parseInt(numberOfSeconds / 60);
  let seconds = numberOfSeconds % 60;
  seconds = seconds > 9 ? seconds : `0${seconds}`;

  return [minutes, seconds];
}

function reInitTest() {
  testText.innerHTML = "";
  testConfiguration.classList.remove("hide");

  testInfo.classList.add("hide");

  testContainer.classList.add("shadow");
  textOverlay.classList.remove("hide");
  startingTextContainer.classList.remove("hide");

  typingTest.classList.remove("no-click");
  currentIndex = 0;
  numberOfWords = 0;
  wrongLetters = [];
  resetTestWordsAndLetters();
  duration = 0;
  userInput.value = "";

  allowUserInput = false;
  userInputLetters = [];
  userInput.blur();

  testStarted = false;
}
