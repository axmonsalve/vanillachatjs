const buttoms = document.querySelector('#botones'),
  userName = document.querySelector('#nombreUsuario'),
  protectedContent = document.querySelector('#protected-content');

// This is the OBSERVER
firebase.auth().onAuthStateChanged((user) => {
  //Show buttoms conditionally
  if (user) {
    // We are Logged...

    buttoms.innerHTML = /*html*/ `
    <button class="btn btn-outline-danger" id="btn-logout">Cerrar Sesión</button>
    `;
    //Show gmail username on nav
    userName.innerHTML = user.displayName;

    closeSession();

    protectedContent.innerHTML = /*template*/ `<p class="text-center lead mt-5">Bienvenido/a ${user.email}</p>`;

  } else {

    buttoms.innerHTML = /*html*/ `
    <button class="btn btn-outline-success mr-2" id="btn-login">Acceder</button>
    `;

    initSession();
    userName.innerHTML = '🗨 Chat';

    protectedContent.innerHTML = /*template*/ `<p class="text-center lead mt-5">Debes iniciar sesión</p>`;

  }
});

const initSession = () => {
  const btnLogin = document.querySelector('#btn-login');
  btnLogin.addEventListener('click', async() => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (e) {
      console.log(e);
    }
  });
};

const closeSession = () => {
  const btnLogout = document.querySelector('#btn-logout');
  btnLogout.addEventListener('click', () => {
    firebase.auth().signOut();
  });
};