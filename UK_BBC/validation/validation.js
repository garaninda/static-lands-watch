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
      it: "Il nome non può contenere numeri",
      rs: "Ime ne može sadržati brojeve",
      de: "Der Name darf keine Zahlen enthalten",
    },
  },
  {
    key: "Name is required",
    dict: {
      es: "Se requiere el nombre",
      fr: "Le nom est requis",
      ru: "Укажите имя",
      bg: "Името е задължително",
      it: "Il nome è obbligatorio",
      rs: "Unesite svoje ime",
      de: "Der Name ist erforderlich",
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
      rs: "Ime je prekratko",
      de: "Der Name ist zu kurz",
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
      de: "Der Name ist zu lang",
    },
  },
  {
    key: "Surname cannot contain numbers",
    dict: {
      es: "El apellido no puede contener números",
      fr: "Le nom de famille ne peut pas contenir des chiffres",
      ru: "Фамилия не может содержать цифры",
      bg: "Фамилията не може да съдържа цифри",
      it: "Il cognome non può contenere numeri",
      rs: "Prezime ne može sadržati brojeve",
      de: "Der Nachname darf keine Zahlen enthalten",
    },
  },
  {
    key: "Surname is required",
    dict: {
      es: "Se requiere el apellido",
      fr: "Le nom de famille est requis",
      ru: "Укажите фамилию",
      bg: "Фамилията е задължителна",
      it: "Il cognome è obbligatorio",
      rs: "Unesite svoje prezime",
      de: "Der Nachname ist erforderlich",
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
      de: "Der Nachname ist zu kurz",
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
      de: "Der Nachname ist zu lang",
    },
  },
  {
    key: "Phone is required",
    dict: {
      es: "Teléfono requerido",
      fr: "Téléphone requis",
      ru: "Телефон обязателен",
      bg: "Телефонът е задължителен",
      it: "Il numero di telefono è obbligatorio",
      rs: "Unesite svoj broj telefona",
      de: "Die Telefonnummer ist erforderlich",
    },
  },
  {
    key: "Phone is invalid",
    dict: {
      es: "Número de teléfono incorrecto",
      fr: "Mauvais numéro de téléphone",
      ru: "Неверный номер телефона",
      bg: "Грешен телефонен номер",
      it: "Numero di telefono non valido",
      rs: "Pogrešan broj telefona",
      de: "Ungültige Telefonnummer",
    },
  },
  {
    key: "Email is required",
    dict: {
      es: "Correo electrónico requerido",
      fr: "E-mail requis",
      ru: "E-mail обязателен",
      bg: "Имейлът е задължителен",
      it: "L'email è obbligatoria",
      rs: "Unesite svoj email",
      de: "Die E-Mail ist erforderlich",
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
      de: "Ungültige E-Mail",
    },
  },
];
const messagesMap = {
  es: {
    unexpectedError: "Se ha producido un error inesperado.",
    duplicateRequest: "Ya ha enviado una solicitud, por favor espere la llamada del operador.",
    successLead: "El registro se ha realizado correctamente. ID de registro: {id}. Ahora será redirigido al inicio de sesión.",
  },
  it: {
    unexpectedError: "Si è verificato un errore imprevisto.",
    duplicateRequest: "Hai già inviato una richiesta, attendi la chiamata dell'operatore.",
    successLead: "La registrazione è avvenuta con successo. ID di registrazione: {id}. Verrai ora reindirizzato alla pagina di accesso.",
  },
  en: {
    unexpectedError: "An unexpected error has occurred.",
    duplicateRequest: "You have already left a request, please wait for the operator to call you.",
    successLead: "Registration was successful. Registration ID: {id}. You will now be redirected to the login page.",
  },
  fr: {
    unexpectedError: "Une erreur inattendue s'est produite.",
    duplicateRequest: "Vous avez déjà envoyé une demande, veuillez attendre l'appel de l'opérateur.",
    successLead: "L'inscription a été effectuée avec succès. ID d'inscription : {id}. Vous allez être redirigé vers la page de connexion.",
  },
  ru: {
    unexpectedError: "Произошла непредвиденная ошибка.",
    duplicateRequest: "Вы уже оставили заявку, дождитесь звонка оператора.",
    successLead: "Регистрация успешно завершена. ID регистрации: {id}. Сейчас вы будете перенаправлены на страницу входа.",
  },
  bg: {
    unexpectedError: "Възникна неочаквана грешка.",
    duplicateRequest: "Вече сте изпратили заявка, моля изчакайте обаждане от оператор.",
    successLead: "Регистрацията беше успешна. ID на регистрация: {id}. Сега ще бъдете пренасочени към страницата за вход.",
  },
  rs: {
    unexpectedError: "Došlo je do neočekivane greške.",
    duplicateRequest: "Već ste poslali zahtev, sačekajte poziv operatera.",
    successLead: "Registracija je uspešno završena. ID registracije: {id}. Bićete preusmereni na stranicu za prijavu.",
  },
  de: {
    unexpectedError: "Es ist ein unerwarteter Fehler aufgetreten.",
    duplicateRequest: "Sie haben bereits eine Anfrage gesendet, bitte warten Sie auf den Anruf des Mitarbeiters.",
    successLead: "Die Registrierung war erfolgreich. Registrierungs-ID: {id}. Sie werden nun zur Anmeldeseite weitergeleitet.",
  },
};

const lang = "en";

function getMessages() {
  return messagesMap[lang] || messagesMap.en;
}

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999";
  return overlay;
}

function createPopupContainer(message) {
  const popup = document.createElement("div");
  popup.id = "message-popup";
  popup.style.position = "fixed";
  popup.style.left = "50%";
  popup.style.top = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.zIndex = "1000";
  popup.style.background = "#fff";
  popup.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
  popup.style.padding = "25px";
  popup.style.borderRadius = "10px";
  popup.style.textAlign = "center";
  popup.style.fontFamily = "Arial, Helvetica, sans-serif";
  popup.style.maxWidth = "350px";
  popup.style.width = "100%";
  popup.style.color = "#333";

  const text = document.createElement("p");
  text.style.fontSize = "16px";
  text.style.marginBottom = "20px";
  text.textContent = message;

  const button = document.createElement("button");
  button.textContent = "OK";
  button.style.backgroundColor = "#7ed321";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";
  button.style.borderRadius = "5px";
  button.style.transition = "background-color 0.3s ease";
  button.addEventListener("click", closePopup);

  popup.appendChild(text);
  popup.appendChild(button);

  return popup;
}

function showPopup(message) {
  // Удаляем предыдущий попап/оверлей, если есть
  closePopup();

  const overlay = createOverlay();
  const popup = createPopupContainer(message);

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

function closePopup() {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("message-popup");
  if (overlay) overlay.remove();
  if (popup) popup.remove();
}

function showMessagePopup(message) {
  showPopup(message);
}

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('form[method="post"]');
  const messages = getMessages();

  forms.forEach((form) => {
    const inputPhone = form.querySelector(`input[name="${FIELD_PHONE}"]`);
    const loader = form.querySelector(".js-rf-loader");
    const iti = intlTelInput(inputPhone, {
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
      allowDropdown: false,
      initialCountry: "GB",
      strictMode: true,
      countrySearch: false,
      autoPlaceholder: "aggressive",
      onlyCountries: ["GB"],
      // nationalMode: false,
      separateDialCode: true,
      hiddenInput: (telInputName) => ({
        phone: `${FULL_PHONE_FIELD_NAME}`,
        // country: `${COUNTRY_FIELD_NAME}`,
        // code: `${COUNTRY_CODE_FIELD}`,
      }),
    });

    const validator = new JustValidate(
      form,
      {
        validateBeforeSubmitting: false,
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
        // {
        //   rule: "email",
        //   errorMessage: "Email is invalid",
        // },
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
        // {
        //   rule: "maxLength",
        //   value: 25,
        //   errorMessage: "Name is too long",
        // },
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
        // {
        //   rule: "minLength",
        //   value: 3,
        //   errorMessage: "Surname is too short",
        // },
        // {
        //   rule: "maxLength",
        //   value: 25,
        //   errorMessage: "Name is too long",
        // },
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
      console.log("click");

      const formData = new FormData(form);

      loader.style.display = "";
      form.querySelector('[type="submit"]').disabled = true;

      formData.set(`${FULL_PHONE_FIELD_NAME}`, iti.getNumber());
      formData.set(`${COUNTRY_FIELD_NAME}`, iti.getSelectedCountryData().iso2);
      formData.set(`${COUNTRY_CODE_FIELD}`, `+${iti.getSelectedCountryData().dialCode}`);

      fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: "same-origin",
      })
        .then((response) => {
          if (!response.ok) {
            showMessagePopup(messages.unexpectedError);
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.extras && data.extras.redirect && data.extras.redirect.url) {
            const email = form.querySelector(`input[name="${FIELD_EMAIL}"]`);
            email && setCookie("user_email_recent", email.value, 3600);
            trackConversion();
            const redirectUrl = data.extras.redirect.url;
            const timerId = setTimeout(() => {
              window.location.href = redirectUrl;
              clearTimeout(timerId);
            }, 5000);

            if (data.lead && data.lead.id) {
              const template = messages.successLead || messages.unexpectedError;
              const successMessage = template.replace("{id}", data.lead.id);
              showMessagePopup(successMessage);
            }
          } else {
            showMessagePopup(messages.unexpectedError);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showMessagePopup(messages.unexpectedError);
        })
        .finally(() => {
          loader.style.display = "none";
          form.querySelector('[type="submit"]').disabled = false;
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
