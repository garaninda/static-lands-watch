document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".signup_form");

    forms.forEach((form) => {
        form.addEventListener("submit", () => {
            const submitButton = form.querySelector('[type="submit"]');

            if (!submitButton || !form.checkValidity()) {
                return;
            }

            const originalText = submitButton.innerText;
            submitButton.innerText = "";
            submitButton.disabled = true;
            addLoader(submitButton);

            setTimeout(() => {
                submitButton.disabled = false;
                removeLoader(submitButton);
                submitButton.innerText = originalText;
            }, 180000);
        });
    });

    function addLoader(button) {
        button.classList.add("form__btn--disabled");

        if (!button.querySelector(".loader")) {
            const loader = document.createElement("span");
            loader.classList.add("loader");
            button.appendChild(loader);
        }
    }

    function removeLoader(button) {
        button.classList.remove("form__btn--disabled");
        const loader = button.querySelector(".loader");

        if (loader) {
            button.removeChild(loader);
        }
    }

    function getParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const entries = [];

        for (const [key, value] of urlParams.entries()) {
            const name = key
                .replace(/^errors\[/, "")
                .replace(/\]\[\d+\]$/, "")
                .replace(/\]$/, "");

            entries.push({ name, value });
        }

        return entries;
    }

    function clearMessages() {
        document.querySelectorAll(".error-message, .error-code").forEach((node) => node.remove());
        document.querySelectorAll(".is-error").forEach((field) => field.classList.remove("is-error"));
    }

    function createMess(errors) {
        clearMessages();

        errors.forEach((item) => {
            const targets = item.name === "phone"
                ? document.querySelectorAll('input[name="phone_raw"]')
                : document.querySelectorAll(`input[name="${item.name}"]`);

            targets.forEach((field) => {
                if (field.type === "hidden") {
                    return;
                }

                const errMess = document.createElement("div");
                errMess.classList.add("error-message");
                errMess.textContent = item.value;
                field.classList.add("is-error");
                field.after(errMess);
            });

            const form = document.querySelector(".signup_form");

            if (!form || item.name !== "error_code") {
                return;
            }

            const errorCode = document.createElement("div");
            errorCode.classList.add("error-code");
            errorCode.textContent = item.value === "409"
                ? "You already have an account"
                : "Server error, please try to send a request later";
            form.appendChild(errorCode);

            setTimeout(() => {
                errorCode.style.display = "none";
            }, 10000);
        });
    }

    function ensureHiddenField(form, name) {
        let input = form.querySelector(`input[name="${name}"]`);

        if (!input) {
            input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            form.appendChild(input);
        }

        return input;
    }

    function formHandle(form) {
        const phoneInput = form.querySelector('input[name="phone_raw"]');

        if (!phoneInput) {
            return;
        }

        const hiddenPhone = ensureHiddenField(form, "phone");
        const hiddenPhoneNumber = ensureHiddenField(form, "phone_number");
        const hiddenPhoneFull = ensureHiddenField(form, "phone_full");
        const hiddenCountry = ensureHiddenField(form, "country");
        const hiddenPhoneCode = ensureHiddenField(form, "phone_code");

        const syncPhone = () => {
            const digits = phoneInput.value.replace(/\D+/g, "");
            const fullPhone = digits ? `+91${digits}` : "";

            hiddenPhone.value = fullPhone;
            hiddenPhoneNumber.value = digits;
            hiddenPhoneFull.value = fullPhone;
            hiddenCountry.value = "IN";
            hiddenPhoneCode.value = "+91";
        };

        const allowNumbersOnly = (event) => {
            const code = event.which || event.keyCode;

            if (code > 31 && (code < 48 || code > 57)) {
                event.preventDefault();
            }
        };

        phoneInput.addEventListener("keypress", allowNumbersOnly, false);
        phoneInput.addEventListener("input", syncPhone);
        phoneInput.addEventListener("blur", syncPhone);
        syncPhone();
    }

    createMess(getParams());
    forms.forEach((form, index) => {
        if (!form.id) {
            form.id = `form${index}`;
        }

        formHandle(form);
    });
});


