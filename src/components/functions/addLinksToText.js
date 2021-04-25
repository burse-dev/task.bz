export default (text) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/ig;
  return text.replace(regex, '<a href="$&" target="_blank" rel="noopener noreferrer nofollow">$&</a>');
};
