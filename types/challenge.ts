export type Challenge = {
  id: string;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  description: string;
  points: number;
  solves: number;
};
