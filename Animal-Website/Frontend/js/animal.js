document.addEventListener("DOMContentLoaded", async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const animalId = queryParams.get("id");

  if (!animalId) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/animals/${animalId}`);
    if (!res.ok) throw new Error("Animal not found");

    const animal = await res.json();

    document.title = animal.name;
    document.getElementById("animal-name").textContent = animal.name;
    document.getElementById("sci-name").textContent = animal.scientificName || "";
    document.getElementById("description").textContent = animal.about || "No description available.";
    document.getElementById("today-date").textContent = new Date().toLocaleDateString();

    const mainImage = document.getElementById("main-image");
    const slideshowImage = document.getElementById("slideshow-image");
    const imageCounter = document.getElementById("image-counter");

    const images = animal.images || [];
    let slideshowImages = [];

    if (images.length > 0) {
      mainImage.src = images[0]; 
      slideshowImages = images.slice(1); 
    }

    let currentIndex = 0;

    function updateSlideshow() {
      if (!slideshowImages.length) return;
      slideshowImage.src = slideshowImages[currentIndex];
      imageCounter.textContent = `${currentIndex + 1}/${slideshowImages.length}`;
    }

    window.left = () => {
      currentIndex = (currentIndex - 1 + slideshowImages.length) % slideshowImages.length;
      updateSlideshow();
    };

    window.right = () => {
      currentIndex = (currentIndex + 1) % slideshowImages.length;
      updateSlideshow();
    };

    if (slideshowImages.length) {
      updateSlideshow();
    } else {
      const slideshowContainer = document.querySelector(".slideshow-container");
      if (slideshowContainer) slideshowContainer.remove();
    }

    
    const video = document.getElementById("animal-video");
    if (animal.videos && animal.videos.length) {
      const raw = animal.videos[0];
      const videoId = raw.includes("youtu.be/")
        ? raw.split("youtu.be/")[1]
        : raw.includes("watch?v=")
        ? raw.split("watch?v=")[1]
        : raw;
      video.src = `https://www.youtube.com/embed/${videoId}`;
    } else {
      video.parentElement.style.display = "none"; // Hide video container
    }

    
    const pastEvents = document.getElementById("past-events");
    const upcomingEvents = document.getElementById("upcoming-events");
    const pastSection = document.getElementById("past-events-section");
    const upcomingSection = document.getElementById("upcoming-events-section");
    const today = new Date();

    let hasPastEvents = false;
    let hasUpcomingEvents = false;

    if (animal.events && animal.events.length) {
      animal.events.forEach((event) => {
        const eventDate = new Date(event.date);
        const card = document.createElement("a");
        card.className = "event-card";
        card.href = event.url;
        card.target = "_blank";
        card.textContent = `${event.name} - ${eventDate.toLocaleDateString()}`;

        if (eventDate < today) {
          pastEvents.appendChild(card);
          hasPastEvents = true;
        } else {
          upcomingEvents.appendChild(card);
          hasUpcomingEvents = true;
        }
      });
    }

    if (!hasPastEvents) {
      pastSection.remove();
    }
    if (!hasUpcomingEvents) {
      upcomingSection.remove();
    }
    if (!hasPastEvents && !hasUpcomingEvents) {
      const allEvents = document.querySelector(".AllEvents");
      if (allEvents) allEvents.remove();
    }

  } catch (err) {
    console.error(err);
    window.location.href = "index.html";
  }
});
