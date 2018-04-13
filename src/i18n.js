import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  es: {
    header: {
      title: 'Flujos de autorización',
      trackings: 'Seguimiento',
      documents: 'Documentos',
      processes: 'Procesos',
      tasks: 'Tareas',
      signout: 'Salir',
    },
    info: {
      aboutTasks: 'Aquí aparecerán tus tareas asignadas',
      aboutTasksMore: 'Actualmente no tienes ninguna tarea asignada.',
      aboutTrackings: 'Aquí aparecerán los procesos en los que estés involucrado',
      aboutTrackingsMore: 'Actualmente no estás involucrado en alguno.',
    },
    request: {
      authorization: 'Ssadf',
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
    trackings: {
      trackings: 'Seguimiento',
    },
    timeline: {
      by: 'Por:',
      reason: 'Motivo:',
      date: 'Fecha:',
    },
    tasks: {
      my_tasks: 'Mis tareas',
    },
    doquer: { 
      new_file: 'Nuevo documento',
    },
    commons: {
      required: 'Requerido',
      send: 'Enviar',
      cancel: 'Cancelar',
      loading: 'Cargando...',
      sending: 'Enviando...',
      upload: 'Subir',
      uploading: 'Subiendo...',
      name: 'Nombre',
    },
    errors: {
      validation: {
        required: 'Algún campo requerido está vacio, porfavor de llenar.',
        invalid_date: 'Alguna fecha es inválida, por favor verifiquela.',
        required_list: 'El campo debería ser una lista.',
      },
      request: {
        authorization: 'Lo sentimos, tus credenciales son inválidas.',
        body: {
          form_array: {
            0: {
              identity_card: 'Los datos enviados no son válidos.',
              reason: 'No logramos procesar tu solicitud ya que el formato enviado fue rechazado.',
              auth: 'Debes seleccionar alguna opción.',
              continue: 'Debes seleccionar una tarea.',
              name: 'Ocurrio un error con el campo nombre.',
              datetime: 'Ocurrió una problema con fecha.',
              secret: 'Debes rellenar el campo "secreto".',
              departure: 'Ocurrió un problema con la fecha de salida.',
              arrival: 'Ocurrió un problema con la fecha de llegada.',
              elections: 'Ocurrió un error respecto a las opciones.',
            },
          },
        },
      },
    },
  },
  en: {
    header: {
      title: 'Authorization flows',
      trackings: 'Tracking',
      documents: 'Documents',
      processes: 'Processes',
      tasks: 'Tasks',
      logout: 'SignOut',
    },
    info: {
      aboutTasks: 'Your assigned tasks will be appear here.',
      aboutTasksMore: 'You do not have assigned tasks yet.',
      aboutTrackings: 'Aquí aparecerán tus tareas asignadas',
      aboutTrackingsMore: 'Actualmente no tienes ninguna tarea asignada.',
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
    trackings: {
      trackings: 'Seguimiento',
    },
    timeline: {
      by: 'By:',
      reason: 'Motivo:',
      date: 'Fecha:',
    },
    tasks: {
      my_tasks: 'My tasks',
    },
    doquer: { 
      new_file: 'Nuevo documento',
    },
    commons: {
      required: 'Required',
      send: 'Send',
      cancel: 'Cancel',
      loading: 'Loading...',
      sending: 'Sending...',
      upload: 'Upload', 
      uploading: 'Uploading...',
      name: 'Nombre',
    },
  },
};

const i18n = new VueI18n({
  locale: 'es', // set locale
  messages, // set locale messages
});

export default i18n;
