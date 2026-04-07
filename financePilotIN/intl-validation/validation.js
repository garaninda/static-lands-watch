const FIELD_NAME = "firstname";
const FIELD_SURNAME = "lastname";
const FIELD_PHONE = "phone";
const FIELD_EMAIL = "email";
const PHONE_NUMBER_FIELD = "phone_number";
const PHONE_FULL_FIELD = "phone_full";
const COUNTRY_FIELD = "country";
const COUNTRY_CODE_FIELD = "phone_code";
const DEFAULT_COUNTRY = "in";
const FORM_STATUS_SELECTOR = "[data-form-status]";

const dictionary = [
  {
    key: "Name cannot contain numbers",
    dict: {
      ru: "Имя не должно содержать цифры",
    },
  },
  {
    key: "Name is required",
    dict: {
      ru: "Введите имя",
    },
  },
  {
    key: "Name is too short",
    dict: {
      ru: "Имя слишком короткое",
    },
  },
  {
    key: "Surname cannot contain numbers",
    dict: {
      ru: "Фамилия не должна содержать цифры",
    },
  },
  {
    key: "Surname is required",
    dict: {
      ru: "Введите фамилию",
    },
  },
  {
    key: "Phone is required",
    dict: {
      ru: "Введите номер телефона",
    },
  },
  {
    key: "Phone is invalid",
    dict: {
      ru: "Введите корректный номер телефона",
    },
  },
  {
    key: "Email is required",
    dict: {
      ru: "Введите email",
    },
  },
  {
    key: "Email is invalid",
    dict: {
      ru: "Введите корректный email",
    },
  },
];

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

function syncPhoneFields(form, iti, phoneInput) {
  const countryData = iti.getSelectedCountryData();
  const rawNumber = phoneInput.value.replace(/\D+/g, "");
  const fullNumber = iti.getNumber() || (rawNumber ? `+91${rawNumber}` : "");

  ensureHiddenField(form, PHONE_NUMBER_FIELD).value = rawNumber;
  ensureHiddenField(form, PHONE_FULL_FIELD).value = fullNumber;
  ensureHiddenField(form, COUNTRY_FIELD).value = (countryData.iso2 || DEFAULT_COUNTRY).toUpperCase();
  ensureHiddenField(form, COUNTRY_CODE_FIELD).value = countryData.dialCode ? `+${countryData.dialCode}` : "";
}

function showFormStatus(form, message) {
  let statusNode = form.querySelector(FORM_STATUS_SELECTOR);

  if (!statusNode) {
    const submitButton = form.querySelector('[type="submit"]');

    statusNode = document.createElement("p");
    statusNode.setAttribute("data-form-status", "");
    statusNode.style.marginTop = "12px";
    statusNode.style.color = "#198754";
    statusNode.style.fontSize = "14px";

    if (submitButton) {
      submitButton.insertAdjacentElement("afterend", statusNode);
    } else {
      form.appendChild(statusNode);
    }
  }

  statusNode.textContent = message;
}

function initFallback(forms) {
  forms.forEach((form) => {
    const phoneInput = form.querySelector(`input[name="${FIELD_PHONE}"]`);

    if (!phoneInput) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      ensureHiddenField(form, PHONE_NUMBER_FIELD).value = phoneInput.value.replace(/\D+/g, "");
      ensureHiddenField(form, PHONE_FULL_FIELD).value = phoneInput.value.trim();
      ensureHiddenField(form, COUNTRY_FIELD).value = DEFAULT_COUNTRY.toUpperCase();
      ensureHiddenField(form, COUNTRY_CODE_FIELD).value = "+91";
      showFormStatus(form, "Form is valid. API integration is disabled for now.");
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const forms = [...document.querySelectorAll('form[method="post"]')];

  if (!forms.length) {
    return;
  }

  let JustValidate;

  try {
    const [{ default: JustValidateModule }] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/just-validate@4/dist/just-validate.es.min.js"),
      import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js"),
    ]);

    JustValidate = JustValidateModule;
  } catch (error) {
    console.error("Validation libraries failed to load.", error);
    initFallback(forms);
    return;
  }

  forms.forEach((form) => {
    const phoneInput = form.querySelector(`input[name="${FIELD_PHONE}"]`);
    const submitButton = form.querySelector('[type="submit"]');

    if (!phoneInput || typeof window.intlTelInput !== "function") {
      return;
    }

    const iti = window.intlTelInput(phoneInput, {
      initialCountry: DEFAULT_COUNTRY,
      onlyCountries: [DEFAULT_COUNTRY],
      allowDropdown: false,
      countrySearch: false,
      strictMode: true,
      autoPlaceholder: "aggressive",
      separateDialCode: true,
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
    });

    const validator = new JustValidate(
      form,
      {
        validateBeforeSubmitting: true,
        tooltip: {
          position: "top",
        },
        errorLabelCssClass: "just-validate-error-label",
        errorFieldCssClass: "just-validate-error-field",
        successFieldCssClass: "just-validate-success-field",
        focusInvalidField: true,
      },
      dictionary
    );

    validator.addField(form.querySelector(`input[name="${FIELD_NAME}"]`), [
      {
        rule: "required",
        errorMessage: "Name is required",
      },
      {
        rule: "customRegexp",
        value: /^[^0-9]+$/,
        errorMessage: "Name cannot contain numbers",
      },
      {
        rule: "minLength",
        value: 2,
        errorMessage: "Name is too short",
      },
    ]);

    validator.addField(form.querySelector(`input[name="${FIELD_SURNAME}"]`), [
      {
        rule: "required",
        errorMessage: "Surname is required",
      },
      {
        rule: "customRegexp",
        value: /^[^0-9]+$/,
        errorMessage: "Surname cannot contain numbers",
      },
    ]);

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

    validator.addField(phoneInput, [
      {
        rule: "required",
        errorMessage: "Phone is required",
      },
      {
        validator: () => {
          const digitsOnly = phoneInput.value.replace(/\D+/g, "");

          if (!window.intlTelInputUtils) {
            return digitsOnly.length >= 10;
          }

          return Boolean(iti.isValidNumber());
        },
        errorMessage: "Phone is invalid",
      },
    ]);

    const updatePhoneState = () => {
      syncPhoneFields(form, iti, phoneInput);
    };

    phoneInput.addEventListener("input", updatePhoneState);
    phoneInput.addEventListener("blur", updatePhoneState);
    phoneInput.addEventListener("countrychange", updatePhoneState);

    updatePhoneState();

    validator.onSuccess((event) => {
      event.preventDefault();
      updatePhoneState();
      showFormStatus(form, "Form is valid. API integration is disabled for now.");

      if (submitButton) {
        submitButton.disabled = false;
      }
    });
  });
});
