import ApiService from './api.service';
import { getAuthToken } from '../utils/auth';

// TODO: dry
function authHeader() {
  const cAuth = getAuthToken();
  let auth = null;

  if (typeof window !== 'undefined') {
    auth = btoa(cAuth);
  } else {
    auth = new Buffer(cAuth).toString('base64');
  }

  if (auth) {
    return { Authorization: `Basic ${auth}` };
  }

  return { };
}

function getPointers({
  actoredUsers = null,
  executionStatus = null,
  executionIds = null,
  dateKey = null,
  dateOrder = null,
  limit = null,
  maxDate = null,
  minDate = null,
  notifiedUsers = null,
  pointerStatus = null,
  pointerTypes = null,
  searchText = null,
  onlyUserAndPatch = null,
} = {}) {
  const baseQuery = [];

  if (
    executionIds &&
    Array.isArray(executionIds)
  ) {
    if (executionIds.length === 1) {
      baseQuery.push({
        'execution.id': executionIds[0],
      });
    } else {
      baseQuery.push({
        'execution.id': { $in: executionIds },
      });
    }
  }

  if (
    executionStatus &&
    Array.isArray(executionStatus) &&
    executionStatus.every(x => ['ongoing', 'finished', 'cancelled'].indexOf(x) >= 0)
  ) {
    if (executionStatus.length === 1) {
      baseQuery.push({
        'execution.status': executionStatus[0],
      });
    } else {
      baseQuery.push({
        'execution.status': { $in: executionStatus },
      });
    }
  }

  if (onlyUserAndPatch) {
    baseQuery.push({
      $or: [
        { state: 'ongoing' },
        { 'node.type': { $in: ['action', 'validation'] } },
        { patch: { $ne: null } },
      ],
    });
  }

  if (
    pointerStatus &&
    Array.isArray(pointerStatus) &&
    pointerStatus.every(x => ['ongoing', 'finished', 'cancelled'].indexOf(x) >= 0)
  ) {
    if (pointerStatus.length === 1) {
      baseQuery.push({
        state: pointerStatus[0],
      });
    } else {
      baseQuery.push({
        state: { $in: pointerStatus },
      });
    }
  }

  if (
    pointerTypes &&
    Array.isArray(pointerTypes) &&
    pointerTypes.every(x => ['action', 'validation'].indexOf(x) >= 0)
  ) {
    if (pointerTypes.length === 1) {
      baseQuery.push({
        'node.type': pointerTypes[0],
      });
    } else {
      baseQuery.push({
        'node.type': { $in: pointerTypes },
      });
    }
  }

  if (
    searchText &&
    (typeof searchText === 'string' || searchText instanceof String)
  ) {
    const escapedText = searchText.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

    baseQuery.push({
      $or: [
        { 'node.name': {
          $regex: escapedText,
          $options: '$i',
        } },
        { 'node.description': {
          $regex: escapedText,
          $options: '$i',
        } },
        { 'execution.name': {
          $regex: escapedText,
          $options: '$i',
        } },
        { 'execution.description': {
          $regex: escapedText,
          $options: '$i',
        } },
        { id: escapedText },
        { 'execution.id': escapedText },
      ],
    });
  }

  const userQueries = [];
  if (actoredUsers && Array.isArray(actoredUsers)) {
    if (actoredUsers.length === 1) {
      userQueries.push({
        'actor_list.actor.identifier': actoredUsers[0],
      });
    } else {
      userQueries.push({
        'actor_list.actor.identifier': {
          $in: actoredUsers,
        },
      });
    }
  }

  if (notifiedUsers && Array.isArray(notifiedUsers)) {
    if (notifiedUsers.length === 1) {
      userQueries.push({
        'notified_users.identifier': notifiedUsers[0],
      });
    } else {
      userQueries.push({
        'notified_users.identifier': {
          $in: notifiedUsers,
        },
      });
    }
  }

  if (userQueries.length) {
    baseQuery.push({
      $or: userQueries,
    });
  }

  let sortKey = 'started_at';
  if (['started_at', 'finished_at'].includes(dateKey)) {
    sortKey = dateKey;
  }

  let sortFlag = 'DESCENDING';
  if (['ASCENDING', 'DESCENDING'].includes(dateOrder)) {
    sortFlag = dateOrder;
  }


  if (maxDate) {
    baseQuery.push({
      $expr: {
        $lt: [
          `$${sortKey}`,
          {
            $dateFromString: {
              dateString: maxDate,
            },
          },
        ],
      },
    });
  }

  if (minDate) {
    baseQuery.push({
      $expr: {
        $gt: [
          `$${sortKey}`,
          {
            $dateFromString: {
              dateString: minDate,
            },
          },
        ],
      },
    });
  }

  let qLimit = 10;
  if (
    limit &&
    (typeof limit === 'number' && isFinite(limit))
  ) {
    qLimit = limit;
  }

  const includesList = [
    'id',
    'actor_list',
    'notified_users',
    'started_at',
    'finished_at',
    'node.id',
    'node.name',
    'node.type',
    'execution.name',
    'execution.id',
    'state',
  ];

  const payload = {
    limit: qLimit,
    sort: `${sortKey},${sortFlag}`,
    include: includesList,
  };

  if (baseQuery.length) {
    if (baseQuery.length === 1) {
      const key = Object.keys(baseQuery[0])[0];
      payload[key] = baseQuery[0][key];
    } else {
      payload.$and = baseQuery;
    }
  }

  return ApiService().post(
    '/v1/pointer/search',
    payload,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => ({
      items: data.pointers,
      totalCount: data.total_count,
    }))
    .catch(error => Promise.reject(error));
}

function getPointer(pointerId) {
  const urlId = encodeURIComponent(pointerId);

  return ApiService().get(
    `/v1/pointer/${urlId}`,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => Object.assign({}, data.data))
    .catch(error => Promise.reject(error));
}

function getPointerTask(pointerId) {
  const urlId = encodeURIComponent(pointerId);

  return ApiService().get(
    `/v1/task/${urlId}`,
    Object.assign(
      { headers: authHeader() },
    ),
  )
    .then(({ data }) => Object.assign({}, data.data))
    .catch(error => Promise.reject(error));
}

export const pointerService = {
  getPointers,
  getPointer,
  getPointerTask,
};

export default {
  install(Vue, name = '$pointerService') {
    Object.defineProperty(Vue.prototype, name, { value: pointerService });
  },
};
