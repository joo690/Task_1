// Get all bubble elements
const bubbles = document.querySelectorAll(".bubble");

// Function to generate random number between min and max
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Add floating animation to each bubble
bubbles.forEach((bubble, index) => {
  // Create unique animation for each bubble
  const keyframes = `
    @keyframes float-${index} {
      0% {
        transform: translateY(0) translateX(-50%) scale(1) rotate(0deg);
        opacity: ${bubble.style.opacity || 0.4};
      }
      25% {
        transform: translateY(-10px) translateX(calc(-50% + ${getRandomNumber(
          -10,
          10
        )}px)) scale(${getRandomNumber(0.9, 1.1)}) rotate(${getRandomNumber(
    -10,
    10
  )}deg);
        opacity: ${parseFloat(bubble.style.opacity || 0.4) + 0.1};
      }
      50% {
        transform: translateY(-20px) translateX(-50%) scale(1) rotate(0deg);
        opacity: ${bubble.style.opacity || 0.4};
      }
      75% {
        transform: translateY(-10px) translateX(calc(-50% + ${getRandomNumber(
          -10,
          10
        )}px)) scale(${getRandomNumber(0.9, 1.1)}) rotate(${getRandomNumber(
    -10,
    10
  )}deg);
        opacity: ${parseFloat(bubble.style.opacity || 0.4) + 0.1};
      }
      100% {
        transform: translateY(0) translateX(-50%) scale(1) rotate(0deg);
        opacity: ${bubble.style.opacity || 0.4};
      }
    }
  `;

  // Add keyframes to document
  const styleSheet = document.createElement("style");
  styleSheet.textContent = keyframes;
  document.head.appendChild(styleSheet);

  // Apply animation to bubble with random duration and delay
  const duration = getRandomNumber(4, 8);
  const delay = getRandomNumber(0, 3);

  bubble.style.animation = `float-${index} ${duration}s ease-in-out infinite`;
  bubble.style.animationDelay = `${delay}s`;

  // Add hover effect
  bubble.addEventListener("mouseover", () => {
    bubble.style.animationPlayState = "paused";
    bubble.style.transform = "scale(1.2)";
    bubble.style.transition = "transform 0.3s ease";
  });

  bubble.addEventListener("mouseout", () => {
    bubble.style.animationPlayState = "running";
    bubble.style.transform = "";
    bubble.style.transition = "";
  });
});
