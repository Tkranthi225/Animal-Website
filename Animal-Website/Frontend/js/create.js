document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const form = document.getElementById("animal-form");
  const errorMessage = document.getElementById("error-message");
  const loadSampleBtn = document.getElementById("load-sample");

  if (!token) {
    alert("You must be logged in.");
    window.location.href = "login.html";
    return;
  }

  
  loadSampleBtn.onclick = () => {
    document.getElementById("name").value = "Frilled Shark";
    document.getElementById("scientificName").value = "Chlamydoselachus anguineus";
    document.getElementById("about").value = "The frilled shark is a deep-sea creature with an eel-like body.";
    document.getElementById("images").value =
      "https://static.wixstatic.com/media/06cb1a_82db3b62bf084589b8764560e05d1329~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png",
      "https://img.freepik.com/premium-photo/terrifying-single-shark-with-its-mouth-open-ready-attack_916191-14125.jpg",
      "https://cdna.artstation.com/p/marketplace/presentation_assets/000/732/650/large/file.jpg?1613842677";
    document.getElementById("videos").value = "https://youtu.be/P8TT90LWYaw";
    document.getElementById("events").value =
      "Shark Week\n2024-08-10\nhttps://natgeo.com\nDeep Sea Talk\n2024-09-05\nhttps://natgeo.com";
  };

  
  form.onsubmit = async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    try {
      const name = document.getElementById("name").value.trim();
      const scientificName = document.getElementById("scientificName").value.trim();
      const about = document.getElementById("about").value.trim();
      const images = document.getElementById("images").value.trim().split("\n").map((i) => i.trim()).filter(Boolean);
      const videos = document.getElementById("videos").value.trim().split("\n").map((v) => v.trim()).filter(Boolean);
      const eventsRaw = document.getElementById("events").value.trim().split("\n").map((e) => e.trim()).filter(Boolean);

      if (!name || !scientificName || !about || images.length === 0) {
        errorMessage.textContent = "Please fill out all required fields (name, scientific name, about, images).";
        return;
      }

      if (eventsRaw.length % 3 !== 0) {
        errorMessage.textContent = "Each event must be 3 lines: name, date, and URL.";
        return;
      }

      const events = [];
      for (let i = 0; i < eventsRaw.length; i += 3) {
        events.push({
          name: eventsRaw[i],
          date: eventsRaw[i + 1],
          url: eventsRaw[i + 2],
        });
      }

      const animalData = {
        name,
        scientificName,
        about,
        images,
        videos,
        events,
      };

      const res = await fetch("http://localhost:3000/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, 
        },
        body: JSON.stringify(animalData),
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
      }

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Unknown error");
      }

      alert("Animal successfully created!");
      window.location.href = "admin.html";
    } catch (err) {
      console.error("Error:", err.message);
      errorMessage.textContent = err.message || "Failed to create animal.";
    }
  };
});
