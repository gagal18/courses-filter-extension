document.addEventListener("DOMContentLoaded", async () => {
    let subjectsContainer = document.getElementById("subjectsContainer");
    let saveButton = document.getElementById("saveSelection");

    chrome.storage.local.get(["subjects", "selectedSubjects"], data => {
        let subjects = data.subjects || [];
        let selectedSubjects = new Set(data.selectedSubjects || []);

        if (subjects.length === 0) {
            subjectsContainer.innerHTML = "<p>No subjects found.</p>";
            return;
        }

        subjects.forEach(subject => {
            let div = document.createElement("div");
            div.className = "subject-item";

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = subject;
            checkbox.checked = selectedSubjects.has(subject);

            let label = document.createElement("label");
            label.textContent = subject;

            div.appendChild(checkbox);
            div.appendChild(label);
            subjectsContainer.appendChild(div);
        });
    });

    saveButton.addEventListener("click", () => {
        let selected = [];
        document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
            selected.push(checkbox.value);
        });

        chrome.storage.local.set({ selectedSubjects: selected }, () => {
            console.log("Saved selection:", selected);
            alert("Subjects saved!");
        });
    });
});
