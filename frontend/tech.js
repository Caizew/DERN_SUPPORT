const baseURL = "http://localhost:3001";

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("user");
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("welcomeTech").textContent =
    "Hello, " + username + "! (Technician)";

  loadTechnicianTasks(username);
});

async function loadTechnicianTasks(technician) {
  try {
    const res = await fetch(
      `${baseURL}/api/tasks?technician=${encodeURIComponent(technician)}`
    );
    const tasks = await res.json();

    const tbody = document.querySelector("#tasksTable tbody");
    tbody.innerHTML = "";

    tasks.forEach((task) => {
      const tr = document.createElement("tr");

      // Task ID
      const tdId = document.createElement("td");
      tdId.textContent = task.id;
      tr.appendChild(tdId);

      // Description
      const tdDesc = document.createElement("td");
      tdDesc.textContent = task.description;
      tr.appendChild(tdDesc);

      // Date
      const tdDate = document.createElement("td");
      tdDate.textContent = task.date;
      tr.appendChild(tdDate);

      // Priority
      const tdPrio = document.createElement("td");
      tdPrio.textContent = task.priority;
      tr.appendChild(tdPrio);

      // Status
      const tdStatus = document.createElement("td");
      tdStatus.textContent = task.status;
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("Failed to load your tasks.");
  }
}

function logoutTech() {
  window.location.href = "index.html";
}
