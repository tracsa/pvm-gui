import axios from 'axios';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

class UserService {
  getUserInfo = (identifier) => {
    const urlId = encodeURIComponent(identifier);
    const userInfoUrl = `${API_PVM_URL}/v1/user/_identifier/${urlId}/info`;

    return axios.get(`${userInfoUrl}`);
  };

  getExecutionsByDate = (
    searchText,
    dateKey,
    maxDate,
    minDate,
    actorArray,
    statusArray,
    orderFlag,
  ) => {
    const includesList = [
      'id',
      'started_at',
      'finished_at',
      'name',
      'status',
    ].toString();

    const baseQuery = [];
    if (statusArray) {
      baseQuery.push({
        status: {
          $in: statusArray,
        },
      });
    }

    if (searchText) {
      const escapedText = searchText.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

      baseQuery.push({
        name: {
          $regex: escapedText,
          $options: '$i',
        },
      });
    }

    if (actorArray) {
      baseQuery.push({
        'actor_list.identifier': {
          $in: actorArray,
        },
      });
    }

    const exprQuery = {};
    if (maxDate) {
      if (typeof exprQuery.$and === 'undefined') {
        exprQuery.$and = [];
      }

      exprQuery.$and.push({
        $lt: [
          `$${dateKey}`,
          {
            $dateFromString: {
              dateString: maxDate,
            },
          },
        ],
      });
    }

    if (minDate) {
      if (typeof exprQuery.$and === 'undefined') {
        exprQuery.$and = [];
      }

      exprQuery.$and.push({
        $gt: [
          `$${dateKey}`,
          {
            $dateFromString: {
              dateString: minDate,
            },
          },
        ],
      });
    }

    let sortKey = 'started_at';
    if (['started_at', 'finished_at'].includes(dateKey)) {
      sortKey = dateKey;
    }

    let sortFlag = 'DESCENDING';
    if (['ASCENDING', 'DESCENDING'].includes(orderFlag)) {
      sortFlag = orderFlag;
    }

    const getData = {
      params: {
        $and: JSON.stringify(baseQuery),
        $expr: JSON.stringify(exprQuery),
        include: includesList,
        limit: 10,
        sort: `${sortKey},${sortFlag}`,
      },
    };

    const executionsUrl = `${API_PVM_URL}/v1/execution`;
    return axios.get(`${executionsUrl}`, getData);
  };

  getPointers = (
    maxDate,
    minDate,
    userList,
    bOngoing,
    bCancelled,
    bPatched,
    bNotifications,
    bActored,
  ) => {
    if (bActored) {
      return axios.get();
    }

    return axios.get();
  };

  getUsersActivity = (identifiers, lastMoment) => {
    const userActivityUrl = `${API_PVM_URL}/v1/pointer`;

    // query params
    const actorsQuery = {
      $or: [],
    };

    identifiers.forEach((identifier) => {
      const singleActorQuery = {};
      singleActorQuery[`actors.items.${identifier}`] = { $exists: true };

      actorsQuery.$or.push(singleActorQuery);
    });

    const dateQuery = JSON.stringify({
      $lt: [
        '$started_at',
        {
          $dateFromString: {
            dateString: lastMoment,
          },
        },
      ],
    });

    const activityQuery = JSON.stringify([
      actorsQuery,
    ]);

    const includesList = [
      'id',
      'notified_users',
      'started_at',
      'finished_at',
      'node.name',
      'execution.name',
      'execution.id',
      'state',
      'patch',
      'actors',
    ].toString();

    const getData = {
      params: {
        $or: activityQuery,
        $expr: dateQuery,
        include: includesList,
        limit: 10,
      },
    };

    return axios.get(`${userActivityUrl}`, getData);
  };

  getUsersPending = (identifiers, lastMoment) => {
    const userActivityUrl = `${API_PVM_URL}/v1/pointer`;

    // query params
    const actorsQuery = {
      $or: [],
    };

    identifiers.forEach((identifier) => {
      const singleActorQuery = {};
      singleActorQuery['notified_users.identifier'] = identifier;

      actorsQuery.$or.push(singleActorQuery);
    });

    const dateQuery = JSON.stringify({
      $lt: [
        '$started_at',
        {
          $dateFromString: {
            dateString: lastMoment,
          },
        },
      ],
    });

    const pendingQuery = JSON.stringify([
      actorsQuery,
    ]);

    const includesList = [
      'id',
      'notified_users',
      'started_at',
      'finished_at',
      'node.name',
      'execution.name',
      'execution.id',
      'state',
      'patch',
      'actors',
    ].toString();

    const getData = {
      params: {
        $or: pendingQuery,
        $expr: dateQuery,
        include: includesList,
        state: 'ongoing',
        limit: 10,
      },
    };

    return axios.get(`${userActivityUrl}`, getData);
  };
}

export default {
  install(Vue, name = '$api') {
    Object.defineProperty(Vue.prototype, name, { value: new UserService() });
  },
};
