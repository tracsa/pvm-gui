import axios from 'axios';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

class UserService {
  getUserInfo = (identifier) => {
    const urlId = encodeURIComponent(identifier);
    const userInfoUrl = `${API_PVM_URL}/v1/user/_identifier/${urlId}/info`;

    return axios.get(`${userInfoUrl}`);
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
