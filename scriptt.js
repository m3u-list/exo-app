document.addEventListener("DOMContentLoaded", function () {
    const appContainer = document.querySelector(".app-container");

    // تحميل البيانات من JSON
    fetch("https://raw.githubusercontent.com/m3u-list/exo-app/refs/heads/main/data-app.json")
        .then(response => response.json())
        .then(apps => {
            // تحميل القيم المحفوظة في localStorage
            let storedData = JSON.parse(localStorage.getItem("appDownloads")) || {};
            
            // عرض التطبيقات في الصفحة
            apps.forEach(app => {
                // تحديث عدد التحميلات من localStorage إن وجد
                if (storedData[app.id]) {
                    app.downloads = storedData[app.id];
                }

                const appCard = document.createElement("div");
                appCard.classList.add("app-card");
                appCard.innerHTML = `
                    <img src="${app.image}" alt="${app.name}">
                    <h2>${app.name}</h2>
                    <a target="_blank" href="/h3-page/?id=${app.id}" class="download-btn" data-id="${app.id}">تحميل</a>
                    <div class="download-count">
                        <i class="fas fa-download"></i> <span id="count-${app.id}">${app.downloads}</span> تحميل
                    </div>
                `;
                appContainer.appendChild(appCard);
            });

            // تحديث عدد التحميلات عند الضغط على زر التحميل
            document.querySelectorAll(".download-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let appId = this.getAttribute("data-id");
                    let countElement = document.getElementById(`count-${appId}`);

                    // زيادة العدد +1
                    let newCount = parseInt(countElement.textContent) + 1;
                    countElement.textContent = newCount;

                    // حفظ البيانات في localStorage
                    storedData[appId] = newCount;
                    localStorage.setItem("appDownloads", JSON.stringify(storedData));
                });
            });
        })
        .catch(error => console.error("فشل تحميل البيانات:", error));
});
