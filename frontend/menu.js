document.addEventListener("DOMContentLoaded", () => {
  const menuForm = document.getElementById("menuForm");
  const menuTableBody = document.querySelector("table tbody");

  if (menuForm) {
    menuForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const date = document.getElementById("date").value;
      const day = document.getElementById("day").value;
      const lunch = document.getElementById("lunch").value;
      const dinner = document.getElementById("dinner").value;

      // Send data to backend
      try {
        const response = await fetch("http://127.0.0.1:5000/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, day, lunch, dinner }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Add new row to table dynamically
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${new Date(date).toLocaleDateString()}</td>
            <td>${day}</td>
            <td>${lunch}</td>
            <td>${dinner}</td>
          `;
          menuTableBody.appendChild(newRow);

          alert("Menu added successfully!");
          menuForm.reset();
        } else {
          alert("⚠️ Failed to add menu");
        }
      } catch (err) {
        console.error("Error adding menu:", err);
        alert("⚠️ Error connecting to server");
      }
    });
  }
});
