document.addEventListener("DOMContentLoaded", function () {
const _0x465509=_0x1da9;function _0x1da9(_0x2c870a,_0x143319){const _0x5c20bb=_0x49e0();return _0x1da9=function(_0x49f194,_0xc985ed){_0x49f194=_0x49f194-(-0x22*-0xb5+0x2644+-0x3cf9);let _0x2f8e23=_0x5c20bb[_0x49f194];return _0x2f8e23;},_0x1da9(_0x2c870a,_0x143319);}(function(_0x131c6f,_0x23a5fd){const _0x44f50a=_0x1da9,_0xa523ae=_0x131c6f();while(!![]){try{const _0x4568ab=-parseInt(_0x44f50a(0x156))/(-0x550+-0xf*0x167+0x1a5a)+parseInt(_0x44f50a(0x161))/(0x1e35*-0x1+-0x400*-0x3+0x1237)+parseInt(_0x44f50a(0x15b))/(0x2457+-0x3ee+-0x2066)+-parseInt(_0x44f50a(0x162))/(0x3e8+0x1ed1*-0x1+0x3d*0x71)*(-parseInt(_0x44f50a(0x16d))/(0x20bc+0x65*-0x3e+-0x841*0x1))+parseInt(_0x44f50a(0x15f))/(-0xbab+0x1*0xc4d+0x3*-0x34)+-parseInt(_0x44f50a(0x164))/(0x1f29+0x15d3*0x1+-0x34f5)+parseInt(_0x44f50a(0x168))/(-0x94a+0x1d0a+0x2*-0x9dc)*(-parseInt(_0x44f50a(0x16c))/(-0x25bb*-0x1+-0x23be+-0x1f4));if(_0x4568ab===_0x23a5fd)break;else _0xa523ae['push'](_0xa523ae['shift']());}catch(_0x5bd4e0){_0xa523ae['push'](_0xa523ae['shift']());}}}(_0x49e0,0x51980+0x2c8e*-0x10+-0x10601*-0x1));const appContainer=document[_0x465509(0x169)+_0x465509(0x16a)](_0x465509(0x159)+_0x465509(0x167)),GITHUB_TOKEN=_0x465509(0x160)+_0x465509(0x15d)+_0x465509(0x16b)+_0x465509(0x157),REPO_OWNER=_0x465509(0x165),REPO_NAME=_0x465509(0x15c),FILE_PATH=_0x465509(0x166)+_0x465509(0x155),API_URL=_0x465509(0x15e)+_0x465509(0x163)+_0x465509(0x15a)+REPO_OWNER+'/'+REPO_NAME+_0x465509(0x158)+FILE_PATH;function _0x49e0(){const _0x889c64=['.app-conta','om/repos/','1260822kBzdpL','exo-app','Rm5UW8xliy','https://ap','1762908nQaSaj','ghp_k7semp','855924vqQPOQ','125356xqPxDh','i.github.c','1770244kJivCw','m3u-list','data-app.j','iner','100088lOLYsQ','querySelec','tor','Bnx7iPjqv7','549RjdMkx','15qdrLks','son','1223CvGEYw','A1tI3R6HKi','/contents/'];_0x49e0=function(){return _0x889c64;};return _0x49e0();}

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
                    "Authorization": `token ${GITHUB_TOKEN}`,
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
                    "Authorization": `token ${GITHUB_TOKEN}`,
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
