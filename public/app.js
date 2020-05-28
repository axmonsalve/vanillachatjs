const buttoms = document.querySelector('#botones'),
  userName = document.querySelector('#nombreUsuario'),
  protectedContent = document.querySelector('#protected-content'),
  chatForm = document.querySelector('#chat-form')
inputChat = document.querySelector('#input-chat');

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

    //show chat form
    chatForm.classList = 'input-group py-5 fixed-bottom container';

    chatContent(user);

  } else {

    buttoms.innerHTML = /*html*/ `
    <button class="btn btn-outline-success mr-2" id="btn-login">Acceder</button>
    `;

    initSession();
    userName.innerHTML = '🗨 Chat';

    protectedContent.innerHTML = /*template*/ `<p class="text-center lead mt-5">Debes iniciar sesión</p>`;

    chatForm.classList = 'input-group py-5 fixed-bottom container d-none';

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

const chatContent = (user) => {
  // protectedContent.innerHTML = /*template*/ `<p class="text-center lead mt-5">Bienvenido/a ${user.email}</p>`;

  chatForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!inputChat.value.trim()) {
      console.log('input vacio');
      return;
    }

    //Add element to our collection... This is a promise
    firebase.firestore().collection('chat').add({
        text: inputChat.value,
        uid: user.uid,
        date: Date.now()
      })
      .then(res => { console.log('mensaje guardado'); })
      .catch(e => console.log(e));

    //Clean input 
    inputChat.value = '';
  });

  firebase.firestore().collection('chat').orderBy('date')
    .onSnapshot(query => {

      protectedContent.innerHTML = '';
      query.forEach(doc => {
        if (doc.data().uid === user.uid) {
          protectedContent.innerHTML += /*template*/ `<div class="d-flex justify-content-end">
          <span class="badge badge-pill badge-primary">${doc.data().text}</span>
        </div>`;
        } else {
          protectedContent.innerHTML += /*template*/ `<div class="d-flex justify-content-start">
          <span class="badge badge-pill badge-secondary">${doc.data().text}</span>
        </div>`;
        }

        //Scroll on last message
        protectedContent.scrollTop = protectedContent.scrollHeight;
      });
    });
};