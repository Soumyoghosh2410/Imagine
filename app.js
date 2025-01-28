const API_KEY = "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"; // Replace with your Hugging Face token
const submitIcon = document.querySelector("#submit-icon");
const inputElement = document.querySelector("input");
const imagesSection = document.querySelector(".images-section");
const quoteContainer = document.querySelector("#quote-container");
const quoteText = document.querySelector("#quote-text");

// Array of engineering and science quotes
const quotes = [
    "Technology is nothing. What's important is that you have faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them. – Steve Jobs",
    "Any sufficiently advanced technology is indistinguishable from magic. – Arthur C. Clarke",
    "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life. – Bill Gates",
    "The best way to predict the future is to invent it. – Alan Kay",
    "Innovation is the ability to see change as an opportunity, not a threat. – Steve Jobs",
    "The computer was born to solve problems that did not exist before. – Bill Gates",
    "The great growling engine of change – technology. – Alvin Toffler",
    "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past. – Tim Berners-Lee",
    "It's not that we use technology, we live technology. – Godfrey Reggio",
    "The technology you use impresses no one. The experience you create with it is everything. – Sean Gerety",
    "The real danger is not that computers will begin to think like men, but that men will begin to think like computers. – Sydney J. Harris",
    "The most profound technologies are those that disappear. They weave themselves into the fabric of everyday life until they are indistinguishable from it. – Mark Weiser",
    "The future of technology is not about technology itself, but about how we use it to improve lives. – Unknown",
    "Technology is a useful servant but a dangerous master. – Christian Lous Lange",
    "The digital revolution is far more significant than the invention of writing or even of printing. – Douglas Engelbart",
];

// Function to get a random quote
function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to show the quote container with animation
function showQuote() {
    quoteText.textContent = getRandomQuote(); // Set a random quote
    quoteContainer.classList.remove("hidden"); // Remove hidden class
    quoteContainer.classList.add("visible"); // Add visible class
}

// Function to hide the quote container with animation
function hideQuote() {
    quoteContainer.classList.remove("visible"); // Remove visible class
    quoteContainer.classList.add("hidden"); // Add hidden class
}

// Function to query the Hugging Face model
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

// Function to generate and display images
const getImages = async () => {
    const prompt = inputElement.value.trim();

    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    try {
        // Show loading state
        submitIcon.innerHTML = '<i class="fas fa-spinner"></i>'; // Spinner icon
        submitIcon.style.pointerEvents = "none"; // Disable clicks while loading

        // Show a random quote
        showQuote();

        // Query the Hugging Face model
        const imageBlob = await query({ inputs: prompt });

        // Hide the quote container
        hideQuote();

        // Convert blob to URL and display the image
        const imageUrl = URL.createObjectURL(imageBlob);

        // Create a container for the image
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        // Create the image element
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = prompt;

        // Append the image to the container
        imageContainer.appendChild(img);

        // Append the container to the images section
        imagesSection.appendChild(imageContainer);

        // Reset the input and icon
        inputElement.value = "";
        submitIcon.innerHTML = '<i class="fas fa-paper-plane"></i>'; // Submit icon
        submitIcon.style.pointerEvents = "auto"; // Re-enable clicks
    } catch (error) {
        console.error("Error generating image:", error);
        alert("Failed to generate image. Please try again.");

        // Hide the quote container in case of error
        hideQuote();

        // Reset the submit icon
        submitIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
        submitIcon.style.pointerEvents = "auto";
    }
};

// Add event listener to the submit icon
submitIcon.addEventListener("click", getImages);

// Optional: Allow pressing "Enter" to submit
inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getImages();
    }
});