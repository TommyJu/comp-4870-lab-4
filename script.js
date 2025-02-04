async function registerUser(event) {
    event.preventDefault(); // Stop page refresh

    const formData = new FormData(document.getElementById('registration-form'));
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('password-confirmation');
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5289/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            alert("Registration successful");
        } else {
            alert(`Registration failed, bad response: ${response.status}`);
        }
    } catch (error) {
        console.error("Error during registration:", error);
    }
}

async function loginUser(event) {
    event.preventDefault(); // Stop page refresh
    
    const formData = new FormData(document.getElementById('login-form'));
    const email = formData.get('email');
    const password = formData.get('password');
    const twoFactorCode = "I love c#";
    const twoFactorRecoveryCode = "I love c#";

    console.log(email, password, twoFactorCode, twoFactorRecoveryCode);

    try {
        const response = await fetch("http://localhost:5289/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, twoFactorCode, twoFactorRecoveryCode })
        });

        if (response.ok) {
            alert("Login successful!");
            token = (await response.json()).accessToken;
            localStorage.setItem("token", token);
            console.log("Token:", token);
        } else {
            alert(`Login failed, bad response: ${response.status}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

// Get all students (requires authentication)
async function getStudents() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5289/api/students", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const students = await response.json();
            displayStudents(students);
        } else {
            const errorData = await response.json();
            alert(`Failed to fetch students: ${errorData.message || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error fetching students:", error);
        alert("An error occurred while fetching students.");
    }
}

// Display students in the UI
function displayStudents(students) {
    const studentsList = document.getElementById("students-list");
    studentsList.innerHTML = ""; // Clear previous content

    if (students.length === 0) {
        studentsList.innerHTML = "<p>No students found.</p>";
        return;
    }

    // Create a table element
    const table = document.createElement("table");
    table.classList.add("students-table");

    // Create the table header row
    const headerRow = document.createElement("tr");
    const headers = ["Student ID", "First Name", "Last Name", "School"];
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create the table rows for each student
    students.forEach(student => {
        const row = document.createElement("tr");
        Object.values(student).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    // Append the table to the students list container
    studentsList.appendChild(table);
}
