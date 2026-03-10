/** @format */

import "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js";
import JustValidate from "https://cdn.jsdelivr.net/npm/just-validate@4/dist/just-validate.es.min.js";

const FIELD_NAME = "first_name",
  FIELD_SURNAME = "last_name", // FIELD_PHONE = "phone_number";
  FIELD_PHONE = "phone",
  FIELD_EMAIL = "email",
  FULL_PHONE_FIELD_NAME = "phone_full",
  COUNTRY_FIELD_NAME = "country",
  COUNTRY_CODE_FIELD = "area_code";

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
      es: "El apellido no puede contener números",
      fr: "Le nom de famille ne peut pas contenir des chiffres",
      ru: "Фамилия не может содержать цифры",
      bg: "Фамилията не може да съдържа цифри",
      it: "Il cognome non può contenere cifre",
      rs: "Prezime ne može sadržati brojeve",
    },
  },
  {
    key: "Surname is required",
    dict: {
      es: "Se requiere el apellido",
      fr: "Le nom de famille est requis",
      ru: "Укажите фамилию",
      bg: "Дайте ми фамилия",
      it: "Dammi un cognome",
      rs: "Unesite svoje prezime",
    },
  },
  {
    key: "Surname is too short",
    dict: {
      es: "El apellido es muy corto",
      fr: "Le nom de famille est trop court",
      ru: "Фамилия слишком короткая",
      bg: "Фамилията е твърде кратка",
      it: "Il cognome è troppo corto",
      rs: "Prezime je prekratko",
    },
  },
  {
    key: "Surname is too long",
    dict: {
      es: "El apellido es demasiado largo",
      fr: "Le nom de famille est trop long",
      ru: "Фамилия слишком длинная",
      bg: "Фамилията е твърде дълга",
      it: "Il cognome è troppo lungo",
      rs: "Prezime je predugačko",
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
      fr: "E-mail requis",
      ru: "E-mail обязателен",
      bg: "Имейлът е задължителен",
      it: "Email richiesta",
      rs: "Unesite svoj email",
    },
  },
  {
    key: "Email is invalid",
    dict: {
      es: "Correo electrónico inválido",
      fr: "E-mail invalide",
      ru: "Некорректный e-mail",
      bg: "Невалиден имейл",
      it: "Email non valida",
      rs: "Neispravan email",
    },
  },
];

// * Supported es, fr, ru, it, rs
const lang = "en";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[method="post"]');

  forms.forEach((form) => {
    const inputPhone = form.querySelector(`input[name="${FIELD_PHONE}"]`);

    const iti = intlTelInput(inputPhone, {
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
      allowDropdown: false,
      initialCountry: "CA",
      strictMode: true,
      countrySearch: false,
      autoPlaceholder: "aggressive",
      onlyCountries: ["CA"],
      // nationalMode: false,
      separateDialCode: true,
      hiddenInput: (telInputName) => ({
        phone: `${FULL_PHONE_FIELD_NAME}`,
        country: `${COUNTRY_FIELD_NAME}`,
        code: `${COUNTRY_CODE_FIELD}`,
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
        }
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
        }
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
      document.querySelector(".rf-form__loader").style.display = "";
      formData.set(`${FULL_PHONE_FIELD_NAME}`, iti.getNumber());
      formData.set(`${COUNTRY_FIELD_NAME}`, iti.getSelectedCountryData().iso2);
      formData.set(`${COUNTRY_CODE_FIELD}`, `+${iti.getSelectedCountryData().dialCode}`);

      fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: "same-origin",
      })
        .then(async (response) => {
          document.querySelector(".rf-form__loader").style.display = "none";
          let data;
          try {
            data = await response.json();
          } catch (e) {
            showMessagePopup("Unexpected server response.");
            throw e;
          }

          if (response.ok && data.lead_uuid && data.auto_login_url) {
            form.querySelector('[type="submit"]').disabled = true;
            const email = form.querySelector(`input[name="${FIELD_EMAIL}"]`);
            email && setCookie("user_email_recent", email.value, 3600);
            trackConversion();
            const redirectUrl = data.auto_login_url;
            const timerId = setTimeout(() => {
              window.location.href = redirectUrl;
              clearTimeout(timerId);
            }, 5000);

            showMessagePopup(`Registration completed successfully.<br>Registration ID: ${data.lead_uuid}<br>You will now be redirected.`);
            return;
          }

          // Handle errors by code/type
          if (data && data.code) {
            switch (data.code) {
              case 400:
              case 422:
                if (data.type === "DUPLICATION_ERROR" || (data.data && data.data.errorType === "DUPLICATION_ERROR")) {
                  showDuplicatePopup();
                } else if (data.data && data.data.errorMessage) {
                  showMessagePopup(data.data.errorMessage);
                } else if (data.message) {
                  showMessagePopup(data.message);
                } else {
                  showMessagePopup("Validation error.");
                }
                break;
              case 401:
                showMessagePopup("Authorization error. Please contact support.");
                break;
              case 404:
                showMessagePopup("API route not found. Please contact support.");
                break;
              case 410:
                showMessagePopup("API version is not supported. Please contact support.");
                break;
              case 415:
                showMessagePopup("Unsupported content type. Please contact support.");
                break;
              case 429:
                showMessagePopup("Rate limit exceeded. Please try again later.");
                break;
              default:
                showMessagePopup(data.message || "An unexpected error has occurred.");
            }
          } else {
            showMessagePopup("An unexpected error has occurred.");
          }
          form.querySelector('[type="submit"]').disabled = false;
        })
        .catch((error) => {
          console.error("Error:", error);
          form.querySelector('[type="submit"]').disabled = false;
          document.querySelector(".rf-form__loader").style.display = "none";
          showMessagePopup("An unexpected error has occurred.");
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
