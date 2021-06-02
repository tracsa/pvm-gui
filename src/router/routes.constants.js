import { getAuthUser } from '../utils/auth';

function getCurrentUserFullname() {
  const user = getAuthUser();

  if (user && user.fullname) {
    return user.fullname;
  } else if (user) {
    return user.username;
  }

  return '';
}

function getCurrentUserUsername() {
  const user = getAuthUser();

  if (user) {
    return user.username;
  }

  return '';
}

export const Routes = Object.freeze([
  {
    feed: 'myPendingTasks',
    title: () => `Mis tareas pendientes (${getCurrentUserFullname()})`,
    description: 'Aquí podrás ver las tareas que te faltan por realizar',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'pointer',
      executionStatus: ['ongoing'],
      pointerStatus: ['ongoing'],
      notifiedUsers: () => [getCurrentUserUsername()],
    },
  },
  {
    feed: 'myTasks',
    title: () => `Tareas relacionadas conmigo (${getCurrentUserFullname()})`,
    description: 'Estas son todas las tareas que te asignaron o realizaste',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'pointer',
      actoredUsers: () => [getCurrentUserUsername()],
      notifiedUsers: () => [getCurrentUserUsername()],
      pointerStatus: null,
      executionStatus: null,
    },
  },
  {
    feed: 'allPendingTasks',
    title: 'Todas las tareas pendientes',
    description: 'Estás viendo todas las tareas en curso, de todos los usuarios',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'pointer',
      executionStatus: ['ongoing'],
      pointerStatus: ['ongoing'],
    },
  },
  {
    feed: 'allOngoingTasks',
    title: 'Todas las tareas pendientes',
    description: 'Estás viendo todas las tareas en curso, de todos los usuarios',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'pointer',
      executionStatus: ['ongoing'],
      pointerStatus: ['ongoing'],
    },
  },
  {
    feed: 'allOngoingExecutions',
    title: 'Todos los flujos de autorización en curso',
    description: '¿Quieres ver todos los procesos en curso? Aquí estan',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'execution',
      executionStatus: ['ongoing'],
    },
  },
  {
    feed: 'executionHistory',
    title: 'Historial de flujos de autorización',
    description: '¿Buscas un proceso finalizado o cancelado? Este es el lugar correcto',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'execution',
      executionStatus: ['finished', 'cancelled'],
    },
  },
  {
    feed: 'taskHistory',
    title: 'Historial de tareas',
    description: '¿En busca de tareas finalizadas o canceladas? Llegaste al lugar indicado',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'pointer',
      pointerStatus: ['finished', 'cancelled'],
      onlyUserAndPatch: true,
    },
  },
  {
    feed: 'userTasks',
    title: to => `Tareas de ${to.query.u}`,
    description: 'Todas las tareas de un usuario',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: {
      objType: 'pointer',
      actoredUsers: (to) => [to.query.u],
      notifiedUsers: (to) => [to.query.u],
    },
  },
  {
    feed: 'general',
    title: 'Tablero general',
    description: 'Aquí tienes todos los filtros para buscar',
    executionId: to => to.query.e,
    query: to => to.query.q,
    fixedPayload: { },
  },
]);

export default { Routes };
