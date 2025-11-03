document.getElementById("loadBtn").addEventListener("click", () => {
    loadStudentList();
});

document.getElementById("saveBtn").addEventListener("click", () => {
    savePayments();
});

let currentStudents = []; // store loaded data

// Utility: get number of days in a month
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate(); // JS months: 1-based
}

function loadStudentList() {
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);
    const totalDays = getDaysInMonth(month, year);

    fetch("http://localhost:5000/studentlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year })
    })
    .then(res => res.json())
    .then(data => {
        // Calculate total_expense & remaining_amount
        currentStudents = data.map(s => {
            const deduction = (s.absent_slots || 0) * 45;
            const totalExpense = (totalDays * 90) - deduction;
            return {
                ...s,
                total_expense: totalExpense,
                paid_amount: s.paid_amount || 0,
                remaining_amount: totalExpense - (s.paid_amount || 0),
                month,
                year
            };
        });

        renderTable(currentStudents);
    })
    .catch(err => console.error("Error:", err));
}

function renderTable(students) {
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No data available</td></tr>`;
        return;
    }

    students.forEach((s, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.name}</td>
            <td>${s.username}</td>
            <td>${s.mobile}</td>
            <td>${s.absent_slots}</td>
            <td>${s.total_expense}</td>
            <td><input type="number" min="0" value="${s.paid_amount}" data-index="${index}" class="paidInput"></td>
            <td class="remaining">${s.remaining_amount}</td>
        `;
        tbody.appendChild(tr);
    });

    // Update remaining amount when paid input changes
    document.querySelectorAll(".paidInput").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = e.target.dataset.index;
            const paid = parseFloat(e.target.value) || 0;
            currentStudents[idx].paid_amount = paid;
            currentStudents[idx].remaining_amount = currentStudents[idx].total_expense - paid;
            e.target.parentElement.nextElementSibling.textContent = currentStudents[idx].remaining_amount;
        });
    });
}

function savePayments() {
    fetch("http://localhost:5000/saveStudentPayments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentList: currentStudents })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) alert("Payments saved successfully!");
    })
    .catch(err => console.error("Error saving payments:", err));
}
