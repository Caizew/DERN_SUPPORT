const baseURL = "http://localhost:3001";

// In-memory array for spareParts (unchanged)
let spareParts = [
  { id: 1, name: "Hard Drive", quantity: 12 },
  { id: 2, name: "RAM Module", quantity: 25 },
];

// We no longer use a separate `jobs` array, because tasks are stored in backend
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("user");
  if (!username) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("welcome").textContent =
    "Welcome, " + username + " (Admin)";

  loadPartsTable();
  fetchTechnicians(); // NEW: populate technician dropdown
  loadRequests();
  // No need to load jobs list here, because tasks are fetched per technician
});

/* ---- Spare Parts Inventory (same as before) ---- */
function loadPartsTable() {
  const tbody = document.querySelector("#partsTable tbody");
  tbody.innerHTML = "";

  spareParts.forEach((part) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = part.id;
    tr.appendChild(tdId);

    const tdName = document.createElement("td");
    tdName.textContent = part.name;
    tr.appendChild(tdName);

    const tdQty = document.createElement("td");
    tdQty.textContent = part.quantity;
    tr.appendChild(tdQty);

    const tdAction = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Edit";
    btn.className = "btn small";
    btn.onclick = () => editPart(part.id);
    tdAction.appendChild(btn);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });
}

function searchParts() {
  const filter = document.getElementById("searchPart").value.toLowerCase();
  const rows = document.querySelectorAll("#partsTable tbody tr");
  rows.forEach((row) => {
    const partName = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    row.style.display = partName.includes(filter) ? "" : "none";
  });
}

function editPart(partId) {
  alert("Edit function for Part ID " + partId + " (placeholder)");
  // In a real app, open a modal or redirect to an edit form
}

/* ---- Assign Task to Technician ---- */
async function fetchTechnicians() {
  try {
    const res = await fetch(`${baseURL}/api/technicians`);
    const techs = await res.json();
    const select = document.getElementById("techSelect");

    techs.forEach((tech) => {
      const opt = document.createElement("option");
      opt.value = tech.username;
      opt.textContent = tech.username;
      select.appendChild(opt);
    });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    alert("Failed to load technicians.");
  }
}

async function assignTask() {
  const technician = document.getElementById("techSelect").value;
  const description = document.getElementById("taskDesc").value.trim();
  const date = document.getElementById("taskDate").value;
  const priority = document.getElementById("taskPriority").value;

  if (!technician || !description || !date || !priority) {
    alert("Please fill out all task fields.");
    return;
  }

  try {
    const res = await fetch(`${baseURL}/api/assign-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ technician, description, date, priority }),
    });

    if (res.ok) {
      alert("Task assigned to " + technician);
      // Optionally clear form:
      document.getElementById("assignForm").reset();
    } else {
      const errorData = await res.json();
      alert("Assignment failed: " + (errorData.error || "Try again."));
    }
  } catch (error) {
    console.error("Error assigning task:", error);
    alert("An error occurred while assigning the task.");
  }
}

/* ---- Manage Support Requests (same as before) ---- */
async function loadRequests() {
  try {
    const res = await fetch(`${baseURL}/api/requests`);
    const requests = await res.json();

    const tbody = document.querySelector("#requestsTable tbody");
    tbody.innerHTML = "";

    requests.forEach((req) => {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = req.id;
      tr.appendChild(tdId);

      const tdUser = document.createElement("td");
      tdUser.textContent = req.username;
      tr.appendChild(tdUser);

      const tdMessage = document.createElement("td");
      tdMessage.textContent = req.message;
      tr.appendChild(tdMessage);

      const tdStatus = document.createElement("td");
      const select = document.createElement("select");
      select.className = "status-select";
      ["Pending", "In Progress", "Completed"].forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (req.status === status) option.selected = true;
        select.appendChild(option);
      });
      tdStatus.appendChild(select);
      tr.appendChild(tdStatus);

      const tdAction = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Update";
      btn.className = "btn";
      btn.onclick = () => updateRequest(req.id, select.value);
      tdAction.appendChild(btn);
      tr.appendChild(tdAction);

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading requests:", error);
    alert("Failed to load requests.");
  }
}

async function updateRequest(id, newStatus) {
  try {
    const res = await fetch(`${baseURL}/api/update-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      alert("Request status updated.");
      loadRequests();
    } else {
      const errorData = await res.json();
      alert("Update failed: " + (errorData.error || "Try again."));
    }
  } catch (error) {
    console.error("Error updating request:", error);
    alert("An error occurred while updating.");
  }
}

function logout() {
  window.location.href = "index.html";
}
