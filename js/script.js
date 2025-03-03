document.addEventListener("DOMContentLoaded", function () {
  window.scrollTo(0, 0);

  let eventCounter = 1;

  document.querySelectorAll("portrait").forEach(el => {
    const container = el.closest(".quote-container");
    if (!container) return;

    let extraClasses = Array.from(container.classList).filter(c => c !== "quote-container");
    let era = extraClasses.length > 0 
      ? extraClasses[0].charAt(0).toUpperCase() + extraClasses[0].slice(1) 
      : "Academy"; // Default era

    let nameAttr = el.getAttribute("name");
    if (!nameAttr) return;

    // Parsing folder & emotion
    // If there's a slash, we have "Name/Emotion.png"
    let [characterName, emotion] = nameAttr.split("/");
    if (!emotion) {
      emotion = "Neutral"; // Default emotion
    }

    // Build folder path: "images/Academy Dimitri/Sad.png"
    let folderName = era + " " + characterName;
    let imagePath = `images/${folderName}/${emotion}.png`.replace(/ /g, "%20");

    let messageDiv = document.createElement("div");
    messageDiv.className = "message";

    let messageContent = document.createElement("div");
    messageContent.className = "message-content";

    let img = document.createElement("img");
    img.src = imagePath;
    img.alt = characterName;
    img.className = "portrait";

    let charNameDiv = document.createElement("div");
    charNameDiv.className = "character-name";
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

    let messageId = "event-" + eventCounter++;
    messageDiv.id = messageId;

    // Creating links per message
    let linkIcon = document.createElement("button");
    linkIcon.className = "link-icon";
    linkIcon.innerHTML = '<i class="fa-solid fa-link"></i>';
    messageDiv.appendChild(linkIcon);

    linkIcon.addEventListener("click", function(e) {
      e.preventDefault();
      let eventNum = messageId.split("-")[1];
      history.replaceState(null, null, window.location.pathname + "?event=" + eventNum);
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Debugging purposes
        console.log("Link copied to clipboard!");
      }).catch(err => {
        console.error("Error copying to clipboard: ", err);
      });
      messageDiv.scrollIntoView({ behavior: "smooth", block: "start" });
      messageDiv.classList.add("flash");
      setTimeout(() => {
        messageDiv.classList.remove("flash");
      }, 2000);
    });

    el.parentNode.insertBefore(messageDiv, el);
    el.remove();
  });

  const params = new URLSearchParams(window.location.search);
  const eventParam = params.get("event");
  if (eventParam) {
    const targetId = "event-" + eventParam;
    const target = document.getElementById(targetId);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.classList.add("flash");
        setTimeout(() => target.classList.remove("flash"), 2000);
        
        // Update meta tags dynamically
        const metaTitle = document.querySelector('meta[property="og:title"]');
        const metaDescription = document.querySelector('meta[property="og:description"]');
        const metaImage = document.querySelector('meta[property="og:image"]');
        if (metaTitle && metaDescription && metaImage) {
          const charName = target.querySelector('.character-name').textContent;
          const quoteP = target.querySelector('.message-content p');
          const quoteText = quoteP ? quoteP.textContent : "";
          const imgEl = target.querySelector('.portrait');
          metaTitle.setAttribute("content", charName);
          metaDescription.setAttribute("content", quoteText);
          metaImage.setAttribute("content", imgEl ? imgEl.src : "");
        }
      }, 100);
    }
  }
});
