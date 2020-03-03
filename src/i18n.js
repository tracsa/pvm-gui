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
      history: 'Historial',
      inbox: 'Bandeja de entrada',
      timeline: 'Linea de tiempo',
      summary: 'Resumen',
    },
    info: {
      aboutTasks: 'Aquí aparecerán tus tareas asignadas',
      aboutTasksMore: 'Actualmente no tienes ninguna tarea asignada.',
      aboutTrackings: 'Aquí aparecerán los procesos en los que estés involucrado',
      aboutTrackingsMore: 'Actualmente no estás involucrado en alguno.',
      aboutHistory: 'Aquí aparecerán tus tareas finalizadas',
      aboutHistoryMore: 'Actualmente no tienes ninguna tarea finalizada.',
      aboutManagement: 'Aquí aparecerán tus tareas en proceso',
      aboutManagementMore: 'Actualmente no tienes ninguna tarea en proceso.',
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
      'validation.invalid': 'Las credenciales son inválidas.',
      'validation.required': 'Este campo es requerido.',
      advanced_options: 'Opciones avanzadas',
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
      asignTasks: 'Esta tarea también puede ser realizada por',
    },
    tasks: {
      my_tasks: 'Mis tareas',
    },
    history: {
      history: 'Historial de procesos',
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
      approve: 'Aprobar',
      reject: 'Rechazar',
      hide: 'Ocultar',
      optional: 'Opcional',
    },
    validation: {
      required: 'Este campo es requerido',
      invalid_date: 'Fecha inválida',
      required_list: 'Este campo es requerido',
      uploading_document: 'Ocurrió un error al cargar el archivo.',
      invalid_file: 'El archivo es inválido.',
      required_int: 'Este campo debe ser un número entero.',
    },
    errors: {
      request: {
        authorization: 'Lo sentimos, tus credenciales son inválidas.',
      },
      username: {
        invalid: 'El nombre de usuario es invalido',
      },
    },
    dataFilters: {
      buttons: {
        apply: 'Filtrar',
        clear: 'Limpiar',
        cancel: 'Cancelar',
      },
      messages: {
        noFilters: 'No se han establecido filtros para esta vista.',
      },
      labels: {
        orderBy: 'Ordenar por',
        filterBy: 'Filtrar por',
      },
    },
    inbox: {
      page_title: 'Bandeja de entrada',
      assigned_to: 'Asignado a',
    },
    management: {
      page_title: 'Administración',
      userAssignment: {
        userAssignationSuccesful: 'Asignación de usuario exitosa',
        newUser: 'Nuevo usuario',
        assignTask: 'Asignar tarea',
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
      history: 'History',
      timeline: 'Timeline',
      summary: 'Summary',
    },
    info: {
      aboutTasks: 'Your assigned tasks will be appear here.',
      aboutTasksMore: 'You do not have assigned tasks yet.',
      aboutTrackings: 'Aquí aparecerán tus tareas asignadas',
      aboutTrackingsMore: 'Actualmente no tienes ninguna tarea asignada.',
      aboutHistory: 'Your finished assigned tasks will be appear here.',
      aboutHistoryMore: 'You do not have assigned finished tasks yet',
      aboutManagement: 'Your on going assigned tasks will be appear here.',
      aboutManagementMore: 'You do not have assigned on going tasks yet',
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
    management: {
      page_title: 'Management',
      userAssignment: {
        userAssignationSuccesful: 'User Assignation Succesful',
        newUser: 'New user',
        assignTask: 'Assign task',
      },
    },
    history: {
      history: 'Process history',
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
      approve: 'Approve',
      reject: 'Reject',
      optional: 'Optional',
    },
    errors: {
      request: {
        authorization: 'Your credentials are invalid, sorry',
      },
      username: {
        invalid: 'Invalid username',
      },
    },
    dataFilters: {
      buttons: {
        apply: 'Filter',
        clear: 'Clear',
        cancel: 'Cancel',
      },
      messages: {
        noFilters: 'There are no filters in this view.',
      },
      labels: {
        orderBy: 'Order by',
        filterBy: 'Filter by',
      },
    },
  },
};

const i18n = new VueI18n({
  locale: process.env.LOCALE, // set locale
  messages, // set locale messages
});

export default i18n;
