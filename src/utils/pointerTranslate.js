function getRefInput(refStr, execution) {
  if (!refStr || !execution) { return { }; }

  const [nodeId, actorId, formInfo, inputRef] = refStr.split('.');
  const [, formRef] = formInfo.split(':');

  return execution.state.items[nodeId].actors.items[actorId].forms
    .find(form => form.ref === formRef).inputs.items[inputRef];
}

function getRefLabel(refStr, execution) {
  return getRefInput(refStr, execution).label;
}

function formatValidationInput(inp, execution) {
  if (inp.name === 'response') {
    // TODO: i18n
    return {
      hidden: false,
      label: 'Estado de la información',
      name: inp.name,
      state: 'valid', // ??
      type: 'text',
      value: inp.value,
      value_caption: inp.value === 'accept' ? 'Información valida' : 'Información invalida',
    };
  }

  if (inp.name === 'comment') {
    // TODO: i18n
    return {
      hidden: false,
      label: 'Comentario',
      name: inp.name,
      state: 'valid', // ??
      type: 'text',
      value: inp.value,
      value_caption: inp.value_caption,
    };
  }

  if (inp.name === 'inputs') {
    // TODO: i18n
    let valCap = '';
    if (inp.value) {
      valCap = [
        ...new Set(inp.value.map(x => `"${getRefLabel(x.ref, execution)}"`)),
      ].join(', ');
    }

    return {
      hidden: !inp.value,
      label: 'Información invalida',
      name: inp.name,
      state: 'valid', // ??
      type: 'text',
      value: inp.value,
      value_caption: valCap,
    };
  }

  return inp;
}

const PointerTranslate = (rawPointer, execution) => {
  const pointer = Object.assign({}, rawPointer, { forms: [] });

  if (pointer.patch) {
    pointer.forms = [{
      _type: 'form',
      inputs: [
        {
          hidden: false,
          label: 'Estado de la información',
          name: 'response',
          state: 'valid',
          type: 'text',
          value: 'reject',
          value_caption: 'Información invalida',
        },
        {
          hidden: false,
          label: 'Comentario',
          name: 'comment',
          state: 'valid',
          type: 'text',
          value: pointer.patch.comment,
          value_caption: pointer.patch.comment,
        },
        {
          hidden: false,
          label: 'Información invalida',
          name: 'inputs',
          state: 'valid', // ??
          type: 'text',
          value: pointer.patch.inputs,
          value_caption: [
            ...new Set(pointer.patch.inputs.map(x => `"${getRefLabel(x.ref, execution)}"`)),
          ].join(', '),
        },
      ],
      ref: `${pointer.id}-patch`,
      state: 'valid',
      user: pointer.patch.actor,
    }];

    pointer.patch.inputs
      .filter(x => !!x.value)
      .forEach((x) => {
        const baseInput = getRefInput(x.ref, execution);

        pointer.forms[0].inputs.push(Object.assign(
          {},
          baseInput,
          {
            value: x.value,
            value_caption: x.value_caption,
            label: `Nuevo "${baseInput.label}"`,
          },
        ));
      });

    return pointer;
  }

  if (pointer.node.type === 'action') {
    pointer.forms = Object.entries(rawPointer.actors.items)
      .reduce((accForms, [, v]) => accForms.concat(
        v.forms.reduce((acc, form) => acc.concat(Object.assign(
          {},
          form,
          {
            user: v.user,
            inputs: form.inputs.item_order
              .reduce((acc2, inputId) => acc2.concat(Object.assign(
                {},
                form.inputs.items[inputId],
              )), []),
          },
        )), []),
      ), []);

    pointer.actors.items = {};
    return pointer;
  }

  if (pointer.node.type === 'validation') {
    pointer.forms = Object.entries(rawPointer.actors.items)
      .reduce((accForms, [, v]) => accForms.concat(
        v.forms.reduce((acc, form) => acc.concat(Object.assign(
          {},
          form,
          {
            user: v.user,
            inputs: form.inputs.item_order
              .reduce((acc2, inputId) => acc2.concat(Object.assign(
                {},
                formatValidationInput(form.inputs.items[inputId], execution),
              )), []),
          },
        )), []),
      ), []);

    pointer.actors.items = {};
    return pointer;
  }

  return pointer;
};

export default PointerTranslate;
