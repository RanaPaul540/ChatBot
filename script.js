// ============================
// Send Message Function
// ============================

async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();

    if (!message) return;

    // Display user message
    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear input after sending
    input.value = "";

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Display bot message
        chatBox.innerHTML += `
            <div class="bot-message">
                ${data.reply}
            </div>
        `;

        // Speak bot response
        speakText(data.reply);

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        console.error("Error:", error);

        chatBox.innerHTML += `
            <div class="bot-message">
                Server Error
            </div>
        `;
    }
}


// ============================
// Text To Speech
// ============================

function speakText(text) {

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ============================
// Voice Recognition
// ============================

const voiceBtn =
    document.getElementById("voiceBtn");

if ("webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;

    // Show words while speaking
    recognition.interimResults = true;

    voiceBtn.addEventListener("click", () => {

        voiceBtn.innerHTML =
            "🎙️ Listening...";

        recognition.start();

    });

    recognition.onresult = (event) => {

        let transcript = "";

        for (
            let i = 0;
            i < event.results.length;
            i++
        ) {

            transcript +=
                event.results[i][0]
                .transcript;
        }

        // Show speech in input box
        document.getElementById(
            "userInput"
        ).value = transcript;
    };

    recognition.onerror = (event) => {

        console.log(event.error);

        voiceBtn.innerHTML = "🎤";
    };

    recognition.onend = () => {

        voiceBtn.innerHTML = "🎤";
    };

} else {

    alert(
        "Speech Recognition not supported in this browser."
    );
}


// ============================
// Send Button Click
// ============================

document.getElementById("sendBtn")
.addEventListener("click", () => {

    sendMessage();
});


// ============================
// Enter Key Support
// ============================

document.getElementById("userInput")
.addEventListener("keypress",
function(event) {

    if (event.key === "Enter") {

        sendMessage();
    }
});