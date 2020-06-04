import axios from 'axios';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

class UserService {
  getUserInfo = (identifier) => {
    const urlId = encodeURIComponent(identifier);
    const userInfoUrl = `${API_PVM_URL}/v1/user/_identifier/${urlId}/info`;

    return axios.get(`${userInfoUrl}`);
  };

  getExecutions = (
    searchText,
    maxDate,
    minDate,
    actorArray,
    statusArray,
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
      baseQuery.push({
        name: {
          $regex: searchText,
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
      exprQuery.$lt = [
        '$started_at',
        {
          $dateFromString: {
            dateString: maxDate,
          },
        },
      ];
    }

    if (minDate) {
      exprQuery.$gt = [
        '$started_at',
        {
          $dateFromString: {
            dateString: minDate,
          },
        },
      ];
    }

    const getData = {
      params: {
        $and: JSON.stringify(baseQuery),
        $expr: JSON.stringify(exprQuery),
        include: includesList,
        limit: 10,
        sort: 'started_at,DESCENDING',
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

export default new UserService();
