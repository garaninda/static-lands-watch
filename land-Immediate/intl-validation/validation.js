/** @format */

import "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js";
import JustValidate from "https://cdn.jsdelivr.net/npm/just-validate@4/dist/just-validate.es.min.js";

const FIELD_NAME = "first_name",
  FIELD_SURNAME = "last_name", // FIELD_PHONE = "phone_number";
  FIELD_PHONE = "phone_short",
  FIELD_EMAIL = "email",
  FULL_PHONE_FIELD_NAME = "phone",
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
      es: "Se requiere el nombre",
      fr: "Le nom est requis",
      ru: "Укажите имя",
      bg: "Дайте ми име",
      it: "Dammi un nome",
      rs: "Unesite svoje ime",
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
    key: "Surname cannot contain numbers",
    dict: {
      es: "El segundo nombre no puede contener números",
      fr: "Le second prénom ne peut pas contenir de chiffres",
      ru: "Второе имя не может содержать цифры",
      bg: "Второто име не може да съдържа цифри",
      it: "Il secondo nome non può contenere cifre",
      rs: "Drugo ime ne može sadržati brojeve",
    },
  },
  {
    key: "Surname is required",
    dict: {
      es: "Ingrese el segundo nombre",
      fr: "Le second prénom est requis",
      ru: "Укажите второе имя",
      bg: "Дайте ми второ име",
      it: "Inserisci il secondo nome",
      rs: "Unesite svoje drugo ime",
    },
  },
  {
    key: "Surname is too short",
    dict: {
      es: "El segundo nombre es muy corto",
      fr: "Le second prénom est trop court",
      ru: "Второе имя слишком короткое",
      bg: "Второто име е твърде кратко",
      it: "Il secondo nome è troppo corto",
      rs: "Drugo ime je prekratko",
    },
  },
  {
    key: "Surname is too long",
    dict: {
      es: "El segundo nombre es demasiado largo",
      fr: "Le second prénom est trop long",
      ru: "Второе имя слишком длинное",
      bg: "Второто име е твърде дълго",
      it: "Il secondo nome è troppo lungo",
      rs: "Drugo ime je predugačko",
    },
  },
  {
    key: "Phone is required",
    dict: {
      es: "Teléfono requerido",
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
      es: "Correo electrónico requerido",
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
  }
];

// * Supported es, fr, ru, it, rs
const lang = "es";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[method="post"]');

  forms.forEach((form) => {
    const inputPhone = form.querySelector(`input[name="${FIELD_PHONE}"]`);

    const iti = intlTelInput(inputPhone, {
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
      // allowDropdown: false,
      initialCountry: "MX",
      strictMode: true,
      countrySearch: false,
      autoPlaceholder: "aggressive",
      onlyCountries: ["MX"],
      // nationalMode: false,
      separateDialCode: true,
      hiddenInput: (telInputName) => ({
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

    inputPhone.addEventListener("change", () => {
      console.log(iti.getNumber());
    });

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
          errorMessage: "Surname cannot contain numbers",
        },
        {
          rule: "required",
          errorMessage: "Surname is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Surname is too short",
        },
        {
          rule: "maxLength",
          value: 25,
          errorMessage: "Surname is too long",
        },
      ]);
    }

    if (form.querySelector(`input[name="${FIELD_PHONE}"]`)) {
      validator.addField(form.querySelector(`input[name="${FIELD_PHONE}"]`), [
        {
          rule: "required",
          errorMessage: "Phone is required",
        },
        {
          validator: function (value) {
            return Boolean(iti.isValidNumber());
          },
          errorMessage: "Phone is invalid",
        },
      ]);
    }

    validator.onSuccess((event) => {
      event.preventDefault();
      const formData = new FormData(form);

      formData.set(`${FULL_PHONE_FIELD_NAME}`, iti.getNumber());
      formData.set(`${COUNTRY_FIELD_NAME}`, iti.getSelectedCountryData().iso2);

      fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: "same-origin",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result && data.result === "success") {
            form.querySelector('[type="submit"]').disabled = true;
            const email = form.querySelector(`input[name="${FIELD_EMAIL}"]`);
            if (email && getCookie("user_email_recent") === email.value) {
              showDuplicatePopup();
              form.querySelector('[type="submit"]').disabled = true;
              return false;
            }
            email && setCookie("user_email_recent", email.value, 3600);
            trackConversion();
            const redirectUrl = data.redirect_url;
            const registrationId = data.registration_id;
            let successMessage = `El registro se ha realizado correctamente. ID de registro: ${registrationId}. Usted será redirigido a iniciar sesión ahora`;
            showMessagePopup(successMessage);
            if (redirectUrl) {
              const timerId = setTimeout(() => {
                window.location.href = redirectUrl;
                clearTimeout(timerId);
              }, 5000);
            }
          } else {
            form.querySelector('[type="submit"]').disabled = false;

            // Проверяем наличие конкретных ошибок полей
            if (data.errors) {
              const fieldErrors = Object.entries(data.errors)
                .map(([field, messages]) => {
                  return `${field}: ${messages.join(", ")}`;
                })
                .join("\n");

              showMessagePopup(fieldErrors);
            }

            // Если есть общее сообщение об ошибке
            else if (data.message) {
              showMessagePopup(data.message);
            }

            // Если есть общий error
            else if (data.error) {
              showMessagePopup(data.error);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          form.querySelector('[type="submit"]').disabled = false;
          showMessagePopup("Ha ocurrido un error inesperado");
        });
    });
  });
});

function trackConversion() {
  if (typeof fbq !== "undefined" && fbq.loaded) {
    fbq("track", "Lead");
    console.log("Lead");
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, expireSeconds) {
  const expires = expireSeconds ? new Date(Date.now() + expireSeconds * 1000).toUTCString() : "";
  const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  const pathString = "path=/";
  const expireString = expires ? `; expires=${expires}` : "";

  document.cookie = [cookieString, pathString, expireString].join("; ");
}

function showDuplicatePopup() {
  const overlayHTML = `
<div id="overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0, 0, 0, 0.5); z-index:999;"></div>
`;
  $("body").append(overlayHTML);

  const popupHTML = `
<div id="duplicate-email-popup" style="position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); z-index:1000; background:#fff; box-shadow:0 0 15px rgba(0,0,0,0.3); padding:25px; border-radius:10px; text-align:center; font-family: Arial, Helvetica, sans-serif; max-width:350px; width:100%; color:#333;">
<p style="font-size:16px; margin-bottom:20px;">You have already left a request, please wait for the operator to call you.</p>
<button onclick="closePopup()" style="background-color:#7ed321; color:#fff; border:none; padding:10px 20px; font-size:16px; cursor:pointer; border-radius:5px; transition: background-color 0.3s ease;">
  OK
</button>
</div>
`;
  $("body").append(popupHTML);
}
function showMessagePopup(message) {
  const overlayHTML = `
<div id="overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0, 0, 0, 0.5); z-index:999;"></div>
`;
  $("body").append(overlayHTML);

  const popupHTML = `
<div id="duplicate-email-popup" style="position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); z-index:1000; background:#fff; box-shadow:0 0 15px rgba(0,0,0,0.3); padding:25px; border-radius:10px; text-align:center; font-family: Arial, Helvetica, sans-serif; max-width:350px; width:100%; color:#333;">
<p style="font-size:16px; margin-bottom:20px;">${message}</p>
<button onclick="closePopup()" style="background-color:#7ed321; color:#fff; border:none; padding:10px 20px; font-size:16px; cursor:pointer; border-radius:5px; transition: background-color 0.3s ease;">
  OK
</button>
</div>
`;
  $("body").append(popupHTML);
}

function disableSubmit(form) {
  $(form).find('button[type="submit"]').attr("disabled", true);
}
