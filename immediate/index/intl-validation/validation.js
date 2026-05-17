

import "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js";
import JustValidate from "https://cdn.jsdelivr.net/npm/just-validate@4/dist/just-validate.es.min.js";

const FIELD_NAME = "first_name",
  FIELD_SURNAME = "last_name", 
  FIELD_PHONE = "phone_short",
  FIELD_EMAIL = "email",
  FULL_PHONE_FIELD_NAME = "phone",
  COUNTRY_FIELD_NAME = "country";

const dictionary = [
  {
    key: "Name cannot contain numbers",
    dict: {
      es: "El nombre no debe contener números",
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
      es: "Ingrese su nombre",
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
      es: "El nombre es demasiado corto",
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
      es: "Ingrese su teléfono",
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
      es: "El número de teléfono no es válido",
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
      es: "Ingrese su correo electrónico",
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
      es: "El correo electrónico no es válido",
      fr: "Email invalide",
      ru: "Неверный email",
      bg: "Невалиден имейл",
      it: "Email non valido",
      rs: "Nevažeći email",
    },
  }
];

const lang = "es";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[method="post"]');

  forms.forEach((form) => {
    const inputPhone = form.querySelector(`input[name="${FIELD_PHONE}"]`);

    const iti = intlTelInput(inputPhone, {
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
      
      initialCountry: "MX",
      strictMode: true,
      countrySearch: false,
      autoPlaceholder: "aggressive",
      onlyCountries: ["MX"],
      
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
            let successMessage = `Su registro se realizó correctamente. ID de registro: ${registrationId}. En unos segundos será redirigido para iniciar sesión.`;
            showMessagePopup(successMessage);
            if (redirectUrl) {
              const timerId = setTimeout(() => {
                window.location.href = redirectUrl;
                clearTimeout(timerId);
              }, 5000);
            }
          } else {
            form.querySelector('[type="submit"]').disabled = false;

            if (data.errors) {
              const fieldErrors = Object.entries(data.errors)
                .map(([field, messages]) => {
                  return `${field}: ${messages.join(", ")}`;
                })
                .join("\n");

              showMessagePopup(fieldErrors);
            }

            else if (data.message) {
              showMessagePopup(data.message);
            }

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
  if (window.fbq && window.fbq.loaded) {
    window.fbq("track", "Lead");
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
  showPopup("Ya recibimos su solicitud. Por favor, espere la llamada de un asesor.");
}

function showMessagePopup(message) {
  showPopup(message);
}

function showPopup(message) {
  $("#overlay, #duplicate-email-popup").remove();

  $("<div>", {
    id: "overlay",
    css: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
  }).appendTo("body");

  const popup = $("<div>", {
    id: "duplicate-email-popup",
    css: {
      position: "fixed",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 1000,
      background: "#fff",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      padding: "25px",
      borderRadius: "10px",
      textAlign: "center",
      fontFamily: "Arial, Helvetica, sans-serif",
      maxWidth: "350px",
      width: "100%",
      color: "#333",
    },
  });

  $("<p>", {
    text: String(message || ""),
    css: {
      fontSize: "16px",
      marginBottom: "20px",
      whiteSpace: "pre-line",
    },
  }).appendTo(popup);

  $("<button>", {
    text: "OK",
    type: "button",
    css: {
      backgroundColor: "#7ed321",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    },
  }).on("click", closePopup).appendTo(popup);

  popup.appendTo("body");
}

function closePopup() {
  $("#overlay, #duplicate-email-popup").remove();
}

function disableSubmit(form) {
  $(form).find('button[type="submit"]').attr("disabled", true);
}
