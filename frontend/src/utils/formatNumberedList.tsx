const formatNumberedList = (text: string) => {
  const itemPattern = /(?:^|\s)(\d+)\.\s+/g;
  const matches = Array.from(text.matchAll(itemPattern));

  // Keep normal sentences (and isolated numbers) unchanged. A list must start
  // with "1." and contain at least two items.
  if (matches.length < 2 || matches[0][1] !== '1') {
    return text;
  }

  const intro = text.slice(0, matches[0].index).trim();
  const items = matches.map((match, index) => {
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd = matches[index + 1]?.index ?? text.length;

    return text.slice(contentStart, contentEnd).trim();
  });

  return (
    <>
      {intro && <span style={{ display: 'block' }}>{intro}</span>}
      <ol style={{ margin: intro ? '4px 0 0' : 0, paddingLeft: '20px' }}>
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ol>
    </>
  );
};

export default formatNumberedList;