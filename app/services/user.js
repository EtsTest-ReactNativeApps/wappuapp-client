export const getInitialLetters = (name, length = 2) => {
  if (!name || !name.length) {
    return null;
  }

  return name
    .split(' ')
    .slice(0, length)
    .map(t => t.substring(0, 1))
    .join('');
};

const colors = [
  '#e8f4f1',
  '#ede8f2',
  '#efece6',
  '#e8f0f2',
  '#f7eaf4',
  '#f4f9ea',
  '#f4e3e1',
  '#f2f0e1',
];

export const getAvatarColor = name => {
  return '#eee';
  if (!name) {
    return colors[0];
  }

  const sum = name
    .split(' ')
    .slice(0, 2)
    .reduce((acc, val) => (val || ' ').charCodeAt(0) + acc, 0);

  const colorsLength = colors.length;
  const index = sum % colorsLength;

  return colors[index];
};
