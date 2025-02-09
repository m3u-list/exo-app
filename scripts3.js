document.addEventListener("DOMContentLoaded", function () {
    const appContainer = document.querySelector(".app-container");
    
    // كود GitHub Token مشفر بـ Base64
    const GITHUB_TOKEN = "Z2hwX2s3c2VtcFJtNVVXYjF4bGl5Qm54N2lQanF2N0ExdEUzUjZSKGki"; // الكود مشفر
    const REPO_OWNER = "m3u-list";
    const REPO_NAME = "exo-app";
    const FILE_PATH = "data-app.json";
    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    // دالة ترميز UTF-8 إلى Base64
    function encodeBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // دالة فك ترميز Base64 إلى UTF-8
    function decodeBase64(str) {
        return decodeURIComponent(escape(atob(str)));
    }

    // جلب الملف من GitHub
    async function fetchGitHubFile() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    "Authorization": `token ${decodeBase64(GITHUB_TOKEN)}`,  // فك التشفير هنا
                    "Accept": "application/vnd.github.v3+json"
                }
            });

            if (!response.ok) throw new Error("فشل في جلب البيانات");

            const fileData = await response.json();
            return {
                sha: fileData.sha,
                content: JSON.parse(decodeBase64(fileData.content)) // فك التشفير باستخدام UTF-8
            };
        } catch (error) {
            throw new Error("حدث خطأ أثناء جلب الملف من GitHub");
        }
    }

    // تحديث الملف في GitHub
    async function updateGitHubFile(updatedContent, sha) {
        try {
            const encodedContent = encodeBase64(JSON.stringify(updatedContent, null, 2)); // التشفير مع دعم العربية

            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${decodeBase64(GITHUB_TOKEN)}`,  // فك التشفير هنا
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "تم تحديث عدد التحميلات",
                    content: encodedContent,
                    sha: sha
                })
            });

            if (!response.ok) throw new Error("فشل في تحديث الملف");
        } catch (error) {
            throw new Error("حدث خطأ أثناء تحديث الملف في GitHub");
        }
    }

    // تحميل البيانات من JSON
    fetch("https://cdn.jsdelivr.net/gh/m3u-list/exo-app@refs/heads/main/data-app.json")
        .then(response => response.json())
        .then(async apps => {
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
                    <a target="_blank" href="${app.link}" class="download-btn" data-id="${app.id}">تحميل</a>
                    <div class="download-count">
                        <i class="fas fa-download"></i> <span id="count-${app.id}">${app.downloads}</span> تحميل
                    </div>
                `;
                appContainer.appendChild(appCard);
            });

            // تحديث عدد التحميلات عند الضغط على زر التحميل
            document.querySelectorAll(".download-btn").forEach(button => {
                button.addEventListener("click", async function () {
                    let appId = this.getAttribute("data-id");
                    let countElement = document.getElementById(`count-${appId}`);

                    // زيادة العدد +1
                    let newCount = parseInt(countElement.textContent) + 1;
                    countElement.textContent = newCount;

                    // حفظ البيانات في localStorage
                    storedData[appId] = newCount;
                    localStorage.setItem("appDownloads", JSON.stringify(storedData));

                    // جلب بيانات GitHub وتحديث عدد التحميلات
                    try {
                        const { sha, content } = await fetchGitHubFile();
                        
                        // العثور على التطبيق وتحديث عدد التحميلات
                        const appIndex = content.findIndex(app => app.id === parseInt(appId));
                        if (appIndex !== -1) {
                            content[appIndex].downloads = newCount;
                            await updateGitHubFile(content, sha);
                        }
                    } catch (error) {
                        console.error("حدث خطأ أثناء تحديث البيانات في GitHub:", error);
                    }
                });
            });
        })
        .catch(error => console.error("فشل تحميل البيانات:", error));
});
