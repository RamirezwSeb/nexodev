'use strict';

// Actualiza automáticamente el año del pie de página.
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// Validación accesible del formulario de contacto. No envía datos a un servidor.
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  const fields = {
    nombre: {
      input: document.querySelector('#nombre'),
      error: document.querySelector('#nombreError'),
      validate(value) {
        return value.trim().length >= 3 ? '' : 'Escribe un nombre de al menos 3 caracteres.';
      }
    },
    email: {
      input: document.querySelector('#email'),
      error: document.querySelector('#emailError'),
      validate(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(value.trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.';
      }
    },
    interes: {
      input: document.querySelector('#interes'),
      error: document.querySelector('#interesError'),
      validate(value) {
        return value !== '' ? '' : 'Selecciona el tema que más te interesa.';
      }
    },
    mensaje: {
      input: document.querySelector('#mensaje'),
      error: document.querySelector('#mensajeError'),
      validate(value) {
        return value.trim().length >= 20 ? '' : 'El mensaje debe tener al menos 20 caracteres.';
      }
    },
    acepto: {
      input: document.querySelector('#acepto'),
      error: document.querySelector('#aceptoError'),
      validate(_value, input) {
        return input.checked ? '' : 'Debes marcar esta casilla para continuar.';
      }
    }
  };
  const status = document.querySelector('#formStatus');
  const message = fields.mensaje.input;
  const count = document.querySelector('#mensajeCount');

  function validateField(field) {
    const value = field.input.type === 'checkbox' ? '' : field.input.value;
    const errorMessage = field.validate(value, field.input);
    field.error.textContent = errorMessage;
    field.input.classList.toggle('is-invalid', Boolean(errorMessage));
    field.input.classList.toggle('is-valid', !errorMessage);
    field.input.setAttribute('aria-invalid', String(Boolean(errorMessage)));
    return !errorMessage;
  }

  Object.values(fields).forEach((field) => {
    const eventName = field.input.type === 'checkbox' || field.input.tagName === 'SELECT' ? 'change' : 'input';
    field.input.addEventListener(eventName, () => {
      validateField(field);
      status.className = 'form-status';
      status.textContent = '';
    });
    field.input.addEventListener('blur', () => validateField(field));
  });

  message.addEventListener('input', () => {
    const length = message.value.trim().length;
    count.textContent = `${length} / 20 caracteres mínimos`;
    count.classList.toggle('text-success', length >= 20);
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isFormValid = Object.values(fields).map(validateField).every(Boolean);
    status.className = 'form-status';
    if (!isFormValid) {
      status.textContent = 'Revisa los campos señalados antes de continuar.';
      status.classList.add('error');
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    status.textContent = '¡Excelente! Todos los campos son válidos. Esta demostración no envió ni almacenó tus datos.';
    status.classList.add('success');
    status.focus();
    contactForm.reset();
    Object.values(fields).forEach((field) => {
      field.input.classList.remove('is-valid', 'is-invalid');
      field.input.removeAttribute('aria-invalid');
      field.error.textContent = '';
    });
    count.textContent = '0 / 20 caracteres mínimos';
    count.classList.remove('text-success');
  });
}
