import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  es: {
    header: {
      activities: 'Actividades',
      documents: 'Documentos',
      processes: 'Procesos',
      signout: 'Cerrar sesión',
    },
    signin: {
      title: 'Ingresar',
      description: 'Inicia sesión para comenzar',
      username_placeholder: 'Usuario',
      password_placeholder: 'Contraseña',
      button: 'Ingresar',
      error_signin: 'El usuario o contraseña son incorrectos.',
    },
    processes: {
      start_process: 'Iniciar proceso',
      process: 'Proceso',
      processes: 'Procesos',
    },
    activities: {
      my_activities: 'Mis actividades'
    },
    timeline:{
      by: 'Por:',
      reason: 'Motivo:',
      date: 'Fecha:',
    },
    commons: {
      required: 'Requerido',
      send: 'Enviar',
      cancel: 'Cancelar',
    },
  },
  en: {
    header: {
      activies: 'Activies',
      documents: 'Documents',
      logout: 'SignOut',
    },
    signin: {
      title: 'SignIn',
      description: 'Sign in to start your session',
      username_placeholder: 'Username',
      password_placeholder: 'Password',
      button: 'Sign In',
      error_signin: 'We are sorry but it seems the username or password is wrong.',
    },
    processes: {
      start_process: 'Start process',
      process: 'Process',
      processes: 'Processes',
    },
    activities: {
      my_activities: 'My activities',
    },
    timeline:{
      by: 'By:',
      reason: 'Motivo:',
      date: 'Fecha:',
    },
    commons: {
      required: 'Required',
      send: 'Send',
      cancel: 'Cancel',
    },
  },
};

const i18n = new VueI18n({
  locale: 'es', // set locale
  messages, // set locale messages
});

export default i18n;
