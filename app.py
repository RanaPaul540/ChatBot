
from flask import Flask, render_template, request, jsonify
import ollama
import pyttsx3
import threading

app = Flask(__name__)

# ---------------------------
# Text To Speech
# ---------------------------
engine = pyttsx3.init()
engine.setProperty("rate", 170)


def speak(text):
    engine.say(text)
    engine.runAndWait()


# ---------------------------
# Home Route
# ---------------------------
@app.route("/")
def home():
    return render_template("index.html")


# ---------------------------
# Chat Route
# ---------------------------
@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json["message"]

    response = ollama.chat(
        model="qwen3:0.6b",
        messages=[
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    bot_reply = response["message"]["content"]

    # Speak in background
    threading.Thread(
        target=speak,
        args=(bot_reply,)
    ).start()

    return jsonify({
        "reply": bot_reply
    })


if __name__ == "__main__":
    app.run(debug=True)
