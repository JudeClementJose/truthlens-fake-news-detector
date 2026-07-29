export const TRUSTED_SOURCES = [
  {
    name: 'Reuters Fact Check',
    url: 'https://www.reuters.com/fact-check/',
    category: 'General',
    description: 'Independent global news organization providing verified factual reporting and debunking viral rumors.',
    icon: 'Globe'
  },
  {
    name: 'BBC Reality Check',
    url: 'https://www.bbc.com/news/reality_check',
    category: 'General',
    description: 'Investigative reporting team examining political claims, viral stories, and media claims.',
    icon: 'ShieldCheck'
  },
  {
    name: 'Associated Press (AP) Fact Check',
    url: 'https://apnews.com/ap-fact-check',
    category: 'General',
    description: 'Rigorous fact-checking of global news headlines, political speeches, and viral social posts.',
    icon: 'Newspaper'
  },
  {
    name: 'World Health Organization (WHO)',
    url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters',
    category: 'Health',
    description: 'Official global health authority providing evidence-based medical guidance and myth-busting.',
    icon: 'HeartPulse'
  },
  {
    name: 'FactCheck.org',
    url: 'https://www.factcheck.org/',
    category: 'Politics',
    description: 'Nonpartisan advocate for voters monitoring factual accuracy of major U.S. political figures.',
    icon: 'Scale'
  },
  {
    name: 'Snopes Fact Checker',
    url: 'https://www.snopes.com/',
    category: 'General',
    description: 'Oldest and largest online fact-checking resource investigating urban legends and viral claims.',
    icon: 'Search'
  }
];

export const getTrustedSourcesByCategory = (category) => {
  if (!category || category === 'General') return TRUSTED_SOURCES;
  return TRUSTED_SOURCES.filter(s => s.category === category || s.category === 'General');
};
