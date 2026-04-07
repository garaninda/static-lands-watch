const storage = window.sessionStorage;
const errorQueryParams = new URLSearchParams(window.location.search);
const forms = document.querySelectorAll("form");
const navigations = typeof performance.getEntriesByType === "function"
    ? performance.getEntriesByType("navigation")
    : [];

forms.forEach((form) => form.addEventListener("submit", saveInputs));

if (navigations.some((entry) => entry.type === "reload")) {
    storage.clear();
} else {
    saveErrors();
    loadInputs();
    renderModal(queryHasErrors() ? parseErrors() : loadErrors());
}

function isErrorKey(key) {
    return key.startsWith("error") || key.startsWith("message");
}

function queryHasErrors() {
    return Array.from(errorQueryParams.keys()).some(isErrorKey);
}

function parseErrors() {
    const query = {};

    for (const [key, value] of errorQueryParams.entries()) {
        if (isErrorKey(key)) {
            query[key] = value;
        }
    }

    return expand(query);
}

function getStorageEntries() {
    const entries = [];

    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);

        if (key) {
            entries.push([key, storage.getItem(key)]);
        }
    }

    return entries;
}

function saveErrors() {
    getStorageEntries().forEach(([key]) => {
        if (isErrorKey(key)) {
            storage.removeItem(key);
        }
    });

    for (const [key, value] of errorQueryParams.entries()) {
        if (isErrorKey(key)) {
            storage.setItem(key, value);
        }
    }
}

function loadErrors() {
    const storedErrors = {};

    getStorageEntries().forEach(([key, value]) => {
        if (isErrorKey(key) && value !== null) {
            storedErrors[key] = value;
        }
    });

    return expand(storedErrors);
}

function saveInputs(event) {
    for (const input of event.target.elements) {
        if (["first_name", "last_name", "email"].includes(input.name)) {
            storage.setItem(input.name, input.value);
        }
    }
}

function loadInputs() {
    ["first_name", "last_name", "email"].forEach((inputName) => {
        const savedValue = storage.getItem(inputName);

        if (!savedValue) {
            return;
        }

        document.querySelectorAll(`input[name="${inputName}"]`).forEach((field) => {
            field.value = savedValue;

            if (field.parentElement) {
                field.parentElement.classList.add("focus");
            }
        });
    });
}

function expand(obj) {
    return Object.entries(obj).reduce((accumulator, [propString, value]) => {
        const propArr = propString
            .replace(/\[/g, ".")
            .replace(/\]/g, "")
            .split(".");

        if (propArr.length > 1) {
            const innerProp = propArr.pop();
            const innerObj = propArr.reduce((nested, prop) => {
                nested[prop] ??= {};
                return nested[prop];
            }, accumulator);

            innerObj[innerProp] = value;
        } else {
            accumulator[propString] = value;
        }

        return accumulator;
    }, {});
}

function renderModal(errors) {
    const closeLocale = {
        ar: "إغلاق",
        bg: "Затвори",
        cs: "Zavřít",
        da: "Luk",
        de: "Schließen",
        en: "Close",
        es: "Cerrar",
        et: "Sulge",
        fr: "Fermer",
        hi: "Close",
        hu: "Bezár",
        it: "Chiudi",
        ja: "閉じる",
        ko: "닫기",
        lv: "Aizvērt",
        nl: "Sluiten",
        no: "Lukk",
        pl: "Zamknij",
        pt: "Fechar",
        ro: "Închide",
        sk: "Zavrieť",
        sv: "Stäng",
        tr: "Kapat",
        zh: "关闭"
    };

    if (!errors || Object.keys(errors).length === 0) {
        return;
    }

    const overlay = document.createElement("div");
    const modal = document.createElement("div");
    const close = closeLocale[document.documentElement.lang] || closeLocale.en;
    const error = errors.message ?? errors.error ?? "Server error";

    overlay.className = "errors_overlay";
    modal.className = "errors_modal";
    modal.appendChild(Object.assign(document.createElement("h1"), { innerText: error }));

    if (errors.errors && Object.keys(errors.errors).length > 0) {
        for (const [field, errorList] of Object.entries(errors.errors)) {
            modal.appendChild(Object.assign(document.createElement("h2"), { innerText: field }));

            for (const message of Object.values(errorList)) {
                modal.appendChild(Object.assign(document.createElement("p"), { innerText: message }));
            }
        }
    }

    modal.appendChild(Object.assign(document.createElement("button"), { innerText: close }));
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    modal.querySelector("button").addEventListener("click", (event) => {
        event.target.parentElement.classList.add("errors_modal_hidden");
        overlay.classList.add("errors_overlay_hidden");
    });
}
