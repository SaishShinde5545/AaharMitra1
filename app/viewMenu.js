document.addEventListener("DOMContentLoaded", async () => {
    const menuTableBody = document.getElementById("menuTableBody");

    try {
        const response = await fetch("http://127.0.0.1:5000/menu"); // Fetch from backend
        if (!response.ok) {
            throw new Error("Failed to fetch menu");
        }

        const menuData = await response.json();

        menuTableBody.innerHTML = ""; // Clear old rows

        menuData.forEach(menu => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${menu.date}</td>
                <td>${menu.day}</td>
                <td>${menu.lunch}</td>
                <td>${menu.dinner}</td>
            `;

            menuTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching menu:", error);
        menuTableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Error loading menu</td></tr>`;
    }
});
