document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/animals");
    const animals = await res.json();

    const list = document.getElementById("animal-list");
    animals.forEach((animal) => {
      const card = document.createElement("a");
      card.href = `animal.html?id=${animal.id}`;
      card.className = "animal-card";

      card.innerHTML = `
        <h3>${animal.name}</h3>
        <img src="${animal.images?.[0]}" alt="${animal.name}" />
      `;

      list.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load animals:", err);
  }
});
