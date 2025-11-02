document.getElementById("fetchExpenseBtn").addEventListener("click", () => {
    const month = document.getElementById("month").value;

    // Use username (stored during login)
    const username = localStorage.getItem("username");

    fetch(`http://localhost:5000/viewExpense/${username}/${month}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
            console.log("Fetched Expense Data:", data);

            // Show container
            document.getElementById("expenseResult").style.display = "block";

            // Fill values
            document.getElementById("totalDays").textContent = data.totalDays;
            document.getElementById("totalCost").textContent = data.totalCost;
            document.getElementById("deduction").textContent = data.deduction;
            document.getElementById("finalExpense").textContent = data.finalExpense;

            // Fill absentee table
            const tbody = document.querySelector("#absentForm tbody");
            tbody.innerHTML = "";
            if (data.absentees && data.absentees.length > 0) {
                data.absentees.forEach(absent => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${absent.name}</td>  <!-- ✅ Full name -->
                        <td>${absent.slot}</td>
                        <td>${new Date(absent.date).toLocaleDateString()}</td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td colspan="3">No Absentees</td>`;
                tbody.appendChild(tr);
            }
        })
        .catch(err => {
            console.error("Error fetching expense:", err);
            alert("Failed to load expense details.");
        });
});
