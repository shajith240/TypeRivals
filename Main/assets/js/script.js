const toggleModeInput = document.getElementById("light-mode-toggle");
const logoImage = document.getElementById("logo");

// Function to toggle light/dark mode
const toggleLightMode = () => {
  const isLightMode = document.body.classList.toggle("light-mode");
  localStorage.setItem("lightMode", isLightMode);
  logoImage.src = isLightMode
    ? "assets/img/logo-light-mode.svg"
    : "assets/img/logo.svg";
  document.querySelector("#theme-text").innerText = isLightMode
    ? "serika"
    : "serika dark";
};

// Function to initialize light/dark mode on page load
const initializeLightMode = () => {
  const lightMode = JSON.parse(localStorage.getItem("lightMode"));
  if (lightMode) {
    document.body.classList.add("light-mode");
    toggleModeInput.checked = true;
    logoImage.src = "assets/img/logo-light-mode.svg";
  } else {
    localStorage.setItem("lightMode", false);
    logoImage.src = "assets/img/logo.svg";
  }
};

// Add event listeners
toggleModeInput.addEventListener("click", toggleLightMode);
document.addEventListener("DOMContentLoaded", initializeLightMode);

// Fetch typing text from Gemini API
const fetchTypingText = async () => {
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  const outputElement = document.getElementById("typing-text");

  try {
    console.log("Fetching typing text...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer AIzaSyBNkhJjMkEgqKNA-tOQIMFcC-RpxSmQ6TA`, // Replace with your actual API key
      },
      body: JSON.stringify({
        prompt: "Generate a typing practice text.",
        max_output_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      outputElement.textContent = "Failed to load typing text.";
      return;
    }

    const data = await response.json();
    console.log("Fetched data:", data);
    outputElement.textContent = data.text || "No content available.";
  } catch (error) {
    console.error("Error fetching typing text:", error);
    outputElement.textContent = "Error loading text. Please try again.";
  }
};

// Fetch typing text on page load
document.addEventListener("DOMContentLoaded", fetchTypingText);
