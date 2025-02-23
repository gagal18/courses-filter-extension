document.addEventListener("DOMContentLoaded", async () => {
    let subjectsContainer = document.getElementById("subjectsContainer");
    let saveButton = document.getElementById("saveSelection");
    let searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search subjects...";
    subjectsContainer.parentElement.insertBefore(searchInput, subjectsContainer);

    function renderSubjects(subjects, selectedSubjects) {
        subjectsContainer.innerHTML = "";
        subjects.sort((a, b) => {
            const isASelected = selectedSubjects.has(a.replace(/\s+/g, ''));
            const isBSelected = selectedSubjects.has(b.replace(/\s+/g, ''));
            if (isASelected && !isBSelected) return -1;
            if (!isASelected && isBSelected) return 1;
            return 0;
        });

        subjects.forEach(subject => {
            let div = document.createElement("div");
            div.className = "subject-item";
            div.dataset.subject = subject;

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = subject.replace(/\s+/g, '');
            checkbox.checked = selectedSubjects.has(subject.replace(/\s+/g, ''));

            let label = document.createElement("label");
            label.textContent = subject;

            div.appendChild(checkbox);
            div.appendChild(label);
            subjectsContainer.appendChild(div);
        });
    }

    chrome.storage.local.get(["subjects", "selectedSubjects"], data => {
        let subjects = data.subjects || [];
        let selectedSubjects = new Set(data.selectedSubjects || []);

        if (subjects.length === 0) {
            subjectsContainer.innerHTML = "<p>No subjects found.</p>";
            return;
        }

        renderSubjects(subjects, selectedSubjects);

        searchInput.addEventListener("input", () => {
            let filterText = searchInput.value.toLowerCase();
            document.querySelectorAll(".subject-item").forEach(item => {
                let subjectText = item.dataset.subject.toLowerCase();
                if (subjectText.includes(filterText)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    saveButton.addEventListener("click", () => {
        let selected = [];
        document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
            selected.push(checkbox.value);
        });
        chrome.storage.local.set({ selectedSubjects: selected }, () => {
            chrome.storage.local.get(["subjects", "selectedSubjects"], data => {
                let subjects = data.subjects || [];
                let selectedSubjects = new Set(data.selectedSubjects || []);
                renderSubjects(subjects, selectedSubjects);
            });
        });
    });
});
