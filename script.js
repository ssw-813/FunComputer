const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#nav-list');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar navegación' : 'Abrir navegación');
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const loginDialog = document.querySelector('#login-dialog');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');
const accountButtons = document.querySelectorAll('[data-login-open]');
const closeLoginButton = document.querySelector('[data-login-close]');
const settings = window.FUNCOMPUTER_SUPABASE || {};
const supabaseClient = settings.url && settings.anonKey && window.supabase
  ? window.supabase.createClient(settings.url, settings.anonKey)
  : null;

const setAccountState = (session) => {
  accountButtons.forEach((button) => {
    button.textContent = session ? 'CUENTA ACTIVA' : 'INICIAR SESIÓN';
    button.classList.toggle('is-signed-in', Boolean(session));
  });
};

accountButtons.forEach((button) => button.addEventListener('click', () => {
  if (!supabaseClient) {
    loginStatus.textContent = 'Configura Supabase para activar el acceso.';
  } else {
    loginStatus.textContent = '';
  }
  loginDialog?.showModal();
}));

closeLoginButton?.addEventListener('click', () => loginDialog?.close());

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    loginStatus.textContent = 'Faltan la URL y la clave pública de Supabase.';
    return;
  }
  const data = new FormData(loginForm);
  loginStatus.textContent = 'Conectando…';
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: data.get('email'),
    password: data.get('password')
  });
  if (error) {
    loginStatus.textContent = error.message;
    return;
  }
  loginStatus.textContent = 'Acceso concedido.';
  loginForm.reset();
  setTimeout(() => loginDialog?.close(), 700);
});

supabaseClient?.auth.getSession().then(({ data }) => setAccountState(data.session));
supabaseClient?.auth.onAuthStateChange((_event, session) => setAccountState(session));

document.querySelectorAll('.project-cat3').forEach((project) => {
  const openCat3 = () => window.open(project.dataset.url, '_blank', 'noopener,noreferrer');
  project.addEventListener('click', (event) => {
    if (!event.target.closest('a')) openCat3();
  });
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCat3();
    }
  });
});
