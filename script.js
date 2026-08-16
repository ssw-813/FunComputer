const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#nav-list');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute(
    'aria-label',
    isOpen ? 'Cerrar navegación' : 'Abrir navegación'
  );
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});


/* =========================================
   ANIMACIONES
========================================= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll('.reveal')
  .forEach((element) => observer.observe(element));


/* =========================================
   SUPABASE
========================================= */

const loginDialog = document.querySelector('#login-dialog');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');

const accountButtons =
  document.querySelectorAll('[data-login-open]');

const closeLoginButton =
  document.querySelector('[data-login-close]');


/*
  Supabase configuration comes from:
  /supabase-config.js

  That file defines:

  window.FUNCOMPUTER_SUPABASE = {
    url: 'https://xxxxx.supabase.co',
    anonKey: 'sb_publishable_xxxxx'
  };
*/

const settings = window.FUNCOMPUTER_SUPABASE || {};

let supabaseClient = null;


/* =========================================
   CREATE SUPABASE CLIENT
========================================= */

if (
  settings.url &&
  settings.anonKey &&
  window.supabase &&
  typeof window.supabase.createClient === 'function'
) {
  try {
    supabaseClient = window.supabase.createClient(
      settings.url,
      settings.anonKey
    );

    console.log('✅ FUNCOMPUTER: Supabase conectado');
  } catch (error) {
    console.error(
      '❌ FUNCOMPUTER: Error creando cliente Supabase',
      error
    );
  }
} else {
  console.error(
    '❌ FUNCOMPUTER: Supabase no está configurado correctamente.'
  );

  console.error(
    'Configuración:',
    settings
  );

  console.error(
    'Supabase JS:',
    window.supabase
  );
}


/* =========================================
   ACCOUNT UI
========================================= */

const setAccountState = (session) => {

  accountButtons.forEach((button) => {

    button.textContent = session
      ? 'CUENTA ACTIVA'
      : 'INICIAR SESIÓN';

    button.classList.toggle(
      'is-signed-in',
      Boolean(session)
    );

  });

};


/* =========================================
   OPEN LOGIN
========================================= */

accountButtons.forEach((button) => {

  button.addEventListener('click', () => {

    if (!supabaseClient) {

      loginStatus.textContent =
        'Falta configurar Supabase.';

    } else {

      loginStatus.textContent = '';

    }

    loginDialog?.showModal();

  });

});


/* =========================================
   CLOSE LOGIN
========================================= */

closeLoginButton?.addEventListener(
  'click',
  () => loginDialog?.close()
);


/* =========================================
   LOGIN
========================================= */

loginForm?.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();

    if (!supabaseClient) {

      loginStatus.textContent =
        'Faltan la URL y la clave pública de Supabase.';

      return;
    }


    const data = new FormData(loginForm);

    const email = data.get('email');
    const password = data.get('password');


    if (!email || !password) {

      loginStatus.textContent =
        'Introduce tu correo y contraseña.';

      return;
    }


    loginStatus.textContent =
      'Conectando con FUNCOMPUTER ID…';


    try {

      const { data: authData, error } =
        await supabaseClient.auth.signInWithPassword({

          email,
          password

        });


      if (error) {

        console.error(
          '❌ FUNCOMPUTER LOGIN:',
          error
        );

        loginStatus.textContent =
          error.message;

        return;
      }


      console.log(
        '✅ FUNCOMPUTER ID:',
        authData.user
      );


      loginStatus.textContent =
        'Acceso concedido.';

      setAccountState(
        authData.session
      );


      loginForm.reset();


      setTimeout(
        () => loginDialog?.close(),
        700
      );

    } catch (error) {

      console.error(
        '❌ Error inesperado:',
        error
      );

      loginStatus.textContent =
        'Error conectando con FUNCOMPUTER ID.';

    }

  }
);


/* =========================================
   CHECK CURRENT SESSION
========================================= */

if (supabaseClient) {

  supabaseClient.auth
    .getSession()
    .then(({ data }) => {

      setAccountState(
        data.session
      );

    })
    .catch((error) => {

      console.error(
        '❌ Error obteniendo sesión:',
        error
      );

    });


  /* =========================================
     AUTH STATE CHANGES
  ========================================= */

  supabaseClient.auth.onAuthStateChange(
    (_event, session) => {

      console.log(
        'FUNCOMPUTER ID auth:',
        _event
      );

      setAccountState(
        session
      );

    }
  );

}


/* =========================================
   CAT3
========================================= */

document
  .querySelectorAll('.project-cat3')
  .forEach((project) => {

    const openCat3 = () => {

      window.open(
        project.dataset.url,
        '_blank',
        'noopener,noreferrer'
      );

    };


    project.addEventListener(
      'click',
      (event) => {

        if (!event.target.closest('a')) {
          openCat3();
        }

      }
    );


    project.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {

          event.preventDefault();

          openCat3();

        }

      }
    );

  });


/* =========================================
   DEBUG
========================================= */

console.log(
  'FUNCOMPUTER SUPABASE CONFIG:',
  window.FUNCOMPUTER_SUPABASE
);

console.log(
  'FUNCOMPUTER SUPABASE CLIENT:',
  supabaseClient
);
