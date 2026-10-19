import samplePhoto from '../assets/sample-photo-project.svg';
import sampleCity from '../assets/sample-city-project.svg';
import sampleStillLife from '../assets/sample-still-life-project.svg';

export const samplePortfolioProjects = [
  {
    id: 'demo-photo-project',
    title: 'Golden Hour Portraits',
    context: 'Photography · Demo sample',
    description: 'A small editorial portrait series focused on natural light, relaxed direction, and warm color. Replace this sample with your own work.',
    url: '',
    skills: ['Portrait photography', 'Natural lighting', 'Photo editing'],
    image: samplePhoto,
    imageAlt: 'Illustrated portrait in a golden-hour outdoor setting',
    images: [samplePhoto, sampleCity, sampleStillLife],
    imageAlts: [
      'Illustrated portrait in a golden-hour outdoor setting',
      'Illustrated city street at sunset',
      'Illustrated still life with flowers and a vase'
    ],
    isDemo: true
  },
  {
    id: 'demo-development-project',
    title: 'Community Resource Finder',
    context: 'Web development · Demo sample',
    description: 'A responsive directory concept that helps people find nearby community services. Add a live link or repository when replacing this example.',
    url: 'https://example.com/',
    links: [
      { label: 'Live demo', url: 'https://example.com/' },
      { label: 'Source code', url: 'https://github.com/' }
    ],
    skills: ['React', 'Accessible UI', 'Responsive design'],
    image: '',
    imageAlt: '',
    isDemo: true
  },
  {
    id: 'demo-design-project',
    title: 'Neighborhood Arts Campaign',
    context: 'Visual design · Demo sample',
    description: 'A sample campaign system for a local arts event, including event graphics and a consistent visual identity.',
    url: '',
    skills: ['Visual design', 'Brand systems', 'Adobe Illustrator'],
    image: '',
    imageAlt: '',
    isDemo: true
  }
];
