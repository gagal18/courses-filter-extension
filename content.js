window.addEventListener("load", () => {
    setTimeout(checkAndExtractSubjects, 500);
});

async function checkAndExtractSubjects() {
    chrome.storage.local.get("subjects", (data) => {
        if (!data.subjects || data.subjects.length === 0) {
            extractSubjects();
        }
    });

    const subjectsButton = document.querySelector('[title="Subjects"]');
    subjectsButton.addEventListener('click', async (e) => {
        chrome.storage.local.get("selectedSubjects", (data) => {
            const selectedSubjects = data?.selectedSubjects || [];

            let dropdown = document.querySelector(".asc-context-menu");

            const list = dropdown.querySelectorAll('li');

            const sortedItems = Array.from(list).sort((a, b) => {
                const textA = a.textContent.replace(/\s+/g, '');
                const textB = b.textContent.replace(/\s+/g, '');
                const isASelected = selectedSubjects.includes(textA);
                const isBSelected = selectedSubjects.includes(textB);
                if (isASelected && !isBSelected) return -1;
                if (!isASelected && isBSelected) return 1;

                return textA.localeCompare(textB);
            });

            const ul = list[0].parentElement;

            ul.innerHTML = '';
            sortedItems.forEach(item => ul.appendChild(item));
        });
    });
}

async function extractSubjects() {
    const subjectsButton = document.querySelector('[title="Subjects"]');
    if (!subjectsButton) return;

    subjectsButton.click();

    await new Promise(resolve => setTimeout(resolve, 1000));

    let dropdown = document.querySelector(".asc-context-menu");
    if (!dropdown) return;

    let items = Array.from(dropdown.querySelectorAll("li"));
    let subjects = items.map(item => item.innerText).filter(text => text);

    if (subjects.length > 0) {
        chrome.storage.local.set({ subjects }, () => {
            document.body.click();
        });
    }
}
