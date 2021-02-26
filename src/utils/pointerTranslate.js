const PointerTranslate = (rawPointer) => {
  const pointer = {
    ...rawPointer,
  };

  pointer.forms = Object.entries(rawPointer.actors.items)
    .reduce((accForms, [, v]) => accForms.concat(
      v.forms.reduce((acc, form) => acc.concat({
        ...form,
        actor: v.user,
        inputs: form.inputs.item_order
          .reduce((acc2, inputId) => acc2.concat({
            ...form.inputs.items[inputId],
          }), []),
      }), []),
    ), []);

  return pointer;
};

export default PointerTranslate;
