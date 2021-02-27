function formatValidationInput(inp) {
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
    return {
      hidden: true,
      label: 'Información invalida',
      name: inp.name,
      state: 'valid', // ??
      type: 'text',
      value: inp.value,
      value_caption: inp.value_caption,
    };
  }

  return inp;
}

const PointerTranslate = (rawPointer) => {
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
              ...formatValidationInput(form.inputs.items[inputId]),
            }), []),
        }), []),
      ), []);

    delete pointer.actors;
  }

  return pointer;
};

export default PointerTranslate;
