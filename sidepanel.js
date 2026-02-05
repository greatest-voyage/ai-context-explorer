document.addEventListener("DOMContentLoaded", async () => {
  const output = document.getElementById("ai-response");

  const { lastSelection } = await chrome.storage.local.get("lastSelection");

  if (!lastSelection) {
    output.innerText = "No text selected.";
    return;
  }

  output.innerText = "Thinking…";

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:8b",
        prompt: `Explain this clearly and concisely:\n\n${lastSelection}`,
        stream: false
      })
    });

    const rawText = await response.text(); // 🔑 read first

    if (!rawText) {
      throw new Error("Empty response from Ollama");
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("Raw Ollama response:", rawText);
      throw new Error("Invalid JSON from Ollama");
    }

    output.innerText = data.response || "No response from model.";
  } catch (err) {
    output.innerText =
      "Error connecting to Ollama.\n\n" + err.message;
  }
});
