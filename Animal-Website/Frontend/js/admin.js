document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const nameEl = document.getElementById("admin-name");
  const listEl = document.getElementById("animal-list");
  const logoutBtn = document.getElementById("logout-btn");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  try {
    const res = await fetch("http://localhost:3000/user/profile", {
      method: "GET",
      headers: {
        Authorization: token 
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();
    nameEl.textContent = `Welcome, ${data.name}!`;

    if (!data.animals || data.animals.length === 0) {
      listEl.innerHTML = "<li>You haven't added any animals yet.</li>";
    } else {
      data.animals.forEach((animal) => {
        const li = document.createElement("li");
        li.textContent = `${animal.name} (ID: ${animal.id})`;
        listEl.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    nameEl.textContent = "Unable to load admin data.";
  }
});
