/** @format */

import "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js";
import JustValidate from "https://cdn.jsdelivr.net/npm/just-validate@4/dist/just-validate.es.min.js";

const FIELD_NAME = "first_name",
  FIELD_SURNAME = "last_name",
  FIELD_PHONE = "phone",
  FIELD_EMAIL = "email",
  FULL_PHONE_FIELD_NAME = "phone_full",
  COUNTRY_FIELD_NAME = "country";

const dictionary = [
  {
    key: "Name cannot contain numbers",
    dict: {
      es: "El nombre no puede contener números",
      fr: "Le nom ne peut pas contenir des chiffres",
      ru: "Имя не может содержать цифры",
      bg: "Името не може да съдържа цифри",
      it: "Il nome non può contenere cifre",
      rs: "Ime ne može sadržati brojeve",
    },
  },
  {
    key: "Name is required",
    dict: {
      es: "Ingresa tu nombre",
      fr: "Le nom est requis",
      ru: "Укажите имя",
      bg: "Дайте ми име",
      it: "Dammi un nome",
      rs: "Unesite svoje ime",
    },
  },
  {
    key: "Surname is required",
    dict: {
      es: "Ingresa tus apellidos",
      fr: "Le nom de famille est requis",
      ru: "Укажите фамилию",
      bg: "Фамилията е задължителна",
      it: "Il cognome è richiesto",
      rs: "Unesite svoje prezime",
    },
  },
  {
    key: "Name is too short",
    dict: {
      es: "El nombre es muy corto",
      fr: "Le nom est trop court",
      ru: "Имя слишком короткое",
      bg: "Името е твърде кратко",
      it: "Il nome è troppo corto",
      rs: "Unesite svoje puno ime",
    },
  },
  {
    key: "Name is too long",
    dict: {
      es: "El nombre es demasiado largo",
      fr: "Le nom est trop long",
      ru: "Имя слишком длинное",
      bg: "Името е твърде дълго",
      it: "Il nome è troppo lungo",
      rs: "Ime je predugačko",
    },
  },
  {
    key: "Phone is required",
    dict: {
      es: "Ingresa tu teléfono",
      fr: "Téléphone requis",
      ru: "Телефон обязателен",
      bg: "Телефонът е задължителен",
      it: "Telefono richiesto",
      rs: "Unesite svoj broj telefona",
    },
  },
  {
    key: "Phone is invalid",
    dict: {
      es: "Número de teléfono incorrecto",
      fr: "Mauvais numéro de téléphone",
      ru: "Неверный номер телефона",
      bg: "Грешен телефонен номер",
      it: "Numero di telefono sbagliato",
      rs: "Pogrešan broj telefona",
    },
  },
  {
    key: "Email is required",
    dict: {
      es: "Ingresa tu correo electrónico",
      fr: "Email requis",
      ru: "Email обязателен",
      bg: "Email е задължителен",
      it: "Email richiesto",
      rs: "Email je obavezan",
    },
  },
  {
    key: "Email is invalid",
    dict: {
      es: "Correo electrónico inválido",
      fr: "Email invalide",
      ru: "Неверный email",
      bg: "Невалиден имейл",
      it: "Email non valido",
      rs: "Nevažeći email",
    },
  },
];

// * Supported es, fr, ru, it, rs
const lang = "es";
const COUNTRY = "CR";

const MESSAGES = {
  duplicate: "Ya dejaste una solicitud. Por favor, espera la llamada del especialista.",
  success: (registrationId) =>
    registrationId
      ? `Tu registro se completó correctamente. ID de registro: ${registrationId}. En unos segundos te redirigiremos.`
      : "Tu registro se completó correctamente. En unos segundos te redirigiremos.",
  unexpectedError: "Ocurrió un error inesperado. Inténtalo de nuevo.",
  close: "Aceptar",
};

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[method="post"]');

  forms.forEach((form) => {
    const inputPhone = form.querySelector(`input[name="${FIELD_PHONE}"]`);
    if (!inputPhone) return;

    const iti = intlTelInput(inputPhone, {
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
      initialCountry: COUNTRY,
      strictMode: true,
      countrySearch: false,
      autoPlaceholder: "aggressive",
      onlyCountries: [COUNTRY],
      separateDialCode: true,
      hiddenInput: () => ({
        phone: `${FULL_PHONE_FIELD_NAME}`,
        country: `${COUNTRY_FIELD_NAME}`,
      }),
    });

    const validator = new JustValidate(
      form,
      {
        validateBeforeSubmitting: true,
        tooltip: {
          position: "top",
        },
      },
      dictionary
    );

    validator.setCurrentLocale(lang);

    if (form.querySelector(`input[name="${FIELD_NAME}"]`)) {
      validator.addField(form.querySelector(`input[name="${FIELD_NAME}"]`), [
        {
          rule: "customRegexp",
          value: /^[^0-9]+$/g,
          errorMessage: "Name cannot contain numbers",
        },
        {
          rule: "required",
          errorMessage: "Name is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Name is too short",
        },
        {
          rule: "maxLength",
          value: 25,
          errorMessage: "Name is too long",
        },
      ]);
    }

    if (form.querySelector(`input[name="${FIELD_SURNAME}"]`)) {
      validator.addField(form.querySelector(`input[name="${FIELD_SURNAME}"]`), [
        {
          rule: "customRegexp",
          value: /^[^0-9]+$/g,
          errorMessage: "Name cannot contain numbers",
        },
        {
          rule: "required",
          errorMessage: "Surname is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Name is too short",
        },
      ]);
    }

    if (form.querySelector(`input[name="${FIELD_EMAIL}"]`)) {
      validator.addField(form.querySelector(`input[name="${FIELD_EMAIL}"]`), [
        {
          rule: "required",
          errorMessage: "Email is required",
        },
        {
          rule: "email",
          errorMessage: "Email is invalid",
        },
      ]);
    }

    validator.addField(inputPhone, [
      {
        rule: "required",
        errorMessage: "Phone is required",
      },
      {
        validator: function () {
          return Boolean(iti.isValidNumber());
        },
        errorMessage: "Phone is invalid",
      },
    ]);

    validator.onSuccess((event) => {
      event.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const emailInput = form.querySelector(`input[name="${FIELD_EMAIL}"]`);

      if (emailInput && getCookie("user_email_recent") === emailInput.value) {
        showMessagePopup(MESSAGES.duplicate);
        return false;
      }

      const formData = new FormData(form);
      formData.set(`${FULL_PHONE_FIELD_NAME}`, iti.getNumber());
      formData.set(`${COUNTRY_FIELD_NAME}`, iti.getSelectedCountryData().iso2);

      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: "same-origin",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result && data.result === "success") {
            emailInput && setCookie("user_email_recent", emailInput.value, 3600);
            trackConversion();
            showMessagePopup(MESSAGES.success(data.registration_id));

            const redirectUrl = data.redirect_url;
            if (redirectUrl) {
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 5000);
            }
          } else {
            if (submitBtn) submitBtn.disabled = false;

            if (data.errors) {
              const fieldErrors = Object.entries(data.errors)
                .map(([field, messages]) => `${field}: ${[].concat(messages).join(", ")}`)
                .join("\n");
              showMessagePopup(fieldErrors);
            } else if (data.message) {
              showMessagePopup(data.message);
            } else if (data.error) {
              showMessagePopup(data.error);
            } else {
              showMessagePopup(MESSAGES.unexpectedError);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          if (submitBtn) submitBtn.disabled = false;
          showMessagePopup(MESSAGES.unexpectedError);
        });
    });
  });
});

function trackConversion() {
  if (typeof fbq === "function" && fbq.loaded) {
    fbq("track", "Lead");
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, expireSeconds) {
  const expires = expireSeconds ? new Date(Date.now() + expireSeconds * 1000).toUTCString() : "";
  const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  document.cookie = [cookieString, "path=/", expires ? `expires=${expires}` : ""].filter(Boolean).join("; ");
}

function showMessagePopup(message) {
  closePopup();

  const overlay = document.createElement("div");
  overlay.id = "lead-popup-overlay";
  overlay.className = "lead-popup-overlay";

  const popup = document.createElement("div");
  popup.className = "lead-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");

  const text = document.createElement("p");
  text.className = "lead-popup__text";
  text.textContent = message;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "lead-popup__button";
  button.textContent = MESSAGES.close;
  button.addEventListener("click", closePopup);

  popup.append(text, button);
  overlay.append(popup);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePopup();
  });

  document.body.append(overlay);
  button.focus();
}

function closePopup() {
  const overlay = document.getElementById("lead-popup-overlay");
  if (overlay) overlay.remove();
}
