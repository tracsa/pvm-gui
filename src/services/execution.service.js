import ApiService from './api.service';

class ExecutionService {
  getExecutions = ({
    actoredUsers = null,
    executionIds = null,
    dateKey = null,
    dateOrder = null,
    executionStatus = null,
    maxDate = null,
    minDate = null,
    searchText = null,
  } = {}) => {
    const baseQuery = [];

    if (
      searchText &&
      (typeof searchText === 'string' || searchText instanceof String)
    ) {
      const escapedText = searchText.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

      baseQuery.push({
        $or: [
          { name: {
            $regex: escapedText,
            $options: '$i',
          } },
          { description: {
            $regex: escapedText,
            $options: '$i',
          } },
          { id: escapedText },
        ],
      });
    }

    const userQueries = [];
    if (actoredUsers && actoredUsers.length) {
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

    if (userQueries.length) {
      baseQuery.push({
        $or: userQueries,
      });
    }

    if (
      executionStatus &&
      executionStatus.length &&
      executionStatus.every(x => ['ongoing', 'finished', 'cancelled'].indexOf(x) >= 0)
    ) {
      if (executionStatus.length === 1) {
        baseQuery.push({
          status: executionStatus[0],
        });
      } else {
        baseQuery.push({
          status: { $in: executionStatus },
        });
      }
    }

    if (
      executionIds &&
      executionIds.length
    ) {
      if (executionIds.length === 1) {
        baseQuery.push({
          id: executionIds[0],
        });
      } else {
        baseQuery.push({
          id: { $in: executionIds },
        });
      }
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

    const includeList = [
      'id',
      'notified_users',
      'actor_list',
      'started_at',
      'finished_at',
      'name',
      'status',
    ].toString();

    const payload = {
      params: {
        limit: '10',
        sort: `${sortKey},${sortFlag}`,
        include: includeList,
      },
    };

    if (baseQuery.length) {
      if (baseQuery.length === 1) {
        const key = Object.keys(baseQuery[0])[0];
        payload.params[key] = JSON.stringify(baseQuery[0][key]);
      } else {
        payload.params.$and = JSON.stringify(baseQuery);
      }
    }

    return ApiService().get(
      '/v1/execution',
      payload,
    );
  };

  getExecution = (executionId) => {
    const urlId = encodeURIComponent(executionId);

    return ApiService().get(
      `/v1/execution/${urlId}`,
    );
  };
}

export default {
  install(Vue, name = '$executionService') {
    Object.defineProperty(Vue.prototype, name, { value: new ExecutionService() });
  },
};
