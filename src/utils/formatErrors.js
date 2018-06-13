function formatErrors(errors) {
  const formatted = errors.reduce((obj, error) => {
    // jslint :'(
    const ref = obj;

    let used = false;
    if (typeof error.where === 'string') {
      const match = error.where.match(/request.body.form_array.(\d+).(\w+)/);
      if (match) {
        const index = match[1];
        const name = match[2];

        if (ref[index] === undefined) {
          ref[index] = {};
        }

        if (ref[index][name] === undefined) {
          ref[index][name] = [];
        }

        ref[index][name].push(error);
        used = true;
      }
    }

    if (!used) {
      if (ref.global === undefined) {
        ref.global = [];
      }

      ref.global.push(error);
    }

    return ref;
  }, { global: [] });

  return formatted;
}

export default formatErrors;
