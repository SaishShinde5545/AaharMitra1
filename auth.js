// =======================
// AahaarMitra - auth.js
// =======================


// Change this if your backend runs on a different port
const backendURL = "http://localhost:5000";

// -----------------------
// REGISTER
// -----------------------
async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value; // student / owner

    try {
        const res = await fetch(`${backendURL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name,username,mobile, password, role })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error("❌ Registration error:", err);
        alert("Error registering user. Please try again.");
    }
}

// -----------------------LOGIN-----------------------//
async function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${backendURL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            return;
        }
       
       
        sessionStorage.setItem("role", data.role);


        // Save token and role
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);   // optional



        alert("✅ Login Successful!");

        // Redirect based on role
//         if (data.role === "owner") {
//             window.location.href = "ownerDashboard.html";
//         } else {
//             window.location.href = "studentDashboard.html";
//         }
//     } catch (err) {
//         console.error("❌ Login error:", err);
//         alert("Error logging in. Please try again.");
//     }
// }
//---New  Redirect Code----//
if (data.role === "owner") {
    sessionStorage.setItem("role", "owner");
    window.location.href = "ownerDashboard.html";
} else {
    sessionStorage.setItem("role", "student");
    window.location.href = "studentDashboard.html";
}
 } catch (err) {
        console.error("❌ Login error:", err);
        alert("Error logging in. Please try again.");
    }
}
    
// // ----------------------- LOGOUT -------------------//
// function logoutUser() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     window.location.href = "login.html";
// }


//------------ AUTH CHECK ----------------//
function checkAuth(requiredRole) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return false;
    }

    if (requiredRole && role !== requiredRole) {
        alert("Access Denied!");
        window.location.href = "login.html";
        return false;
    }

    return true;
}

// -----------------------Attach to forms-----------------------//
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) registerForm.addEventListener("submit", registerUser);

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", loginUser);

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
});
// Switch between sections
function openSection(sectionId) {
  document.querySelectorAll("#content section").forEach(sec => sec.style.display = "none");
  document.getElementById(sectionId).style.display = "block";
}

// Logout
function logout() {
  localStorage.removeItem("student"); // clear login data
  window.location.href = "login.html";
}

  // ================= Absentee Mark =================
document.addEventListener("DOMContentLoaded", function () {
    const absentForm = document.getElementById("absentForm");

    if (absentForm) {
        absentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("studentName").value;
            const date = document.getElementById("date").value;
            const slots = Array.from(document.querySelectorAll('input[name="slots"]:checked'))
                     .map(cb => cb.value);

            try {
        const response = await fetch("http://127.0.0.1:5000/absenteeMark", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, date, slots })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`✅ ${data.message}`);
                    absentForm.reset();
                } else {
                    alert(`❌ ${data.message}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong while marking absentee");
            }
        });
    }
});


  //---------------- Feedback Form----------------//
    const feedbackForm = document.getElementById("feedbackForm");

        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const mobile = document.getElementById("mobile").value;
            const feedback = document.getElementById("feedback").value;

           try {
        const response = await fetch("http://127.0.0.1:5000/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name,mobile, feedback })
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Thank you for your feedback!");
            document.getElementById("feedbackForm").reset();
        } else {
            alert("❌ Failed to send feedback: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Failed to connect to server.");
    }
});
