export default (id, types) => {
  const type = types.find(type => type.id === id);

  if (!type) {
    throw Error(`unable to find type by id: ${id}`);
  }

  return type.name;
};
