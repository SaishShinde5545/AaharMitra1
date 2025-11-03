// View Feedback 
document.addEventListener("DOMContentLoaded", async () => {
  const feedbackTable = document.getElementById("feedbackTable");
  if (!feedbackTable) return; // Only run on viewFeedback.html

  try {
    const response = await fetch("http://127.0.0.1:5000/viewFeedback");
    const result = await response.json();

    feedbackTable.innerHTML = ""; // clear any static rows

    if (response.ok && Array.isArray(result)) {
      result.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entry.name}</td>
          <td>${entry.mobile}</td>
          <td>${entry.feedback}</td>
          <td>${new Date(entry.created_at).toLocaleDateString()}</td>
        `;
        feedbackTable.appendChild(row);
      });
    } else {
      feedbackTable.innerHTML = `<tr><td colspan="4">⚠️ Failed to load feedback</td></tr>`;
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
    feedbackTable.innerHTML = `<tr><td colspan="4">⚠️ Error fetching feedback</td></tr>`;
  }
});
