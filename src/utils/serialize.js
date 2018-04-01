function serialize(data) {
  return Object.keys(data).map((key) => {
    const uriKey = encodeURIComponent(key);
    const uriValue = encodeURIComponent(data[key]);

    return `${uriKey}=${uriValue}`;
  }).join('&');
}

export default serialize;
