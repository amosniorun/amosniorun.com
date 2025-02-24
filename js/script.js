document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("portrait").forEach(el => {
      let nameAttr = el.getAttribute("name");
      if (!nameAttr) return;

      let messageDiv = document.createElement("div");
      messageDiv.className = "message";

      let messageContent = document.createElement("div");
      messageContent.className = "message-content";

      let charNameDiv = document.createElement("div");
      charNameDiv.className = "character-name";

      // Parsing folder & emotion
      // If there's a slash, we have "Name/Emotion.png"
      let slashIndex = nameAttr.indexOf("/");
      let folderName, emotion;
      if (slashIndex === -1) {
        // No slash → use "Neutral.png"
        folderName = nameAttr;
        emotion = "Neutral";
      } else {
        folderName = nameAttr.substring(0, slashIndex);
        emotion   = nameAttr.substring(slashIndex + 1);
      }

      let imagePath = `images/${folderName}/${emotion}.png`.replace(/ /g, "%20");

      // Derive the last word of the folder, e.g. "Academy Dimitri" → "Dimitri")
      let folderParts = folderName.split(" ");
      let characterName = folderParts[folderParts.length - 1];

      let img = document.createElement("img");
      img.src = imagePath;
      img.alt = characterName;
      img.className = "portrait";

      charNameDiv.textContent = characterName;

      let nextSibling = el.nextElementSibling;
      if (nextSibling && nextSibling.tagName.toLowerCase() === "p") {
        messageContent.appendChild(charNameDiv);
        messageContent.appendChild(nextSibling);
      } else {
        messageContent.appendChild(charNameDiv);
      }

      messageDiv.appendChild(img);
      messageDiv.appendChild(messageContent);

      el.parentNode.insertBefore(messageDiv, el);

      el.remove();
    });
  });