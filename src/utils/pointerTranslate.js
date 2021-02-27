function getRefLabel(refStr, execution) {
  const [nodeId, actorId, formInfo, inputRef] = refStr.split('.');
  const [, formRef] = formInfo.split(':');

  return execution.state.items[nodeId].actors.items[actorId].forms
    .find(form => form.ref === formRef).inputs.items[inputRef].label;
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
  const pointer = {
    ...rawPointer,
  };

  if (pointer.node.type === 'action') {
    pointer.forms = Object.entries(rawPointer.actors.items)
      .reduce((accForms, [, v]) => accForms.concat(
        v.forms.reduce((acc, form) => acc.concat({
          ...form,
          user: v.user,
          inputs: form.inputs.item_order
            .reduce((acc2, inputId) => acc2.concat({
              ...form.inputs.items[inputId],
            }), []),
        }), []),
      ), []);

    delete pointer.actors;
  }

  if (pointer.node.type === 'validation') {
    pointer.forms = Object.entries(rawPointer.actors.items)
      .reduce((accForms, [, v]) => accForms.concat(
        v.forms.reduce((acc, form) => acc.concat({
          ...form,
          user: v.user,
          inputs: form.inputs.item_order
            .reduce((acc2, inputId) => acc2.concat({
              ...formatValidationInput(form.inputs.items[inputId], execution),
            }), []),
        }), []),
      ), []);

    delete pointer.actors;
  }

  return pointer;
};

export default PointerTranslate;
