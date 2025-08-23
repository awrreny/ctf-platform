export type Challenge = {
  id: number;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  description: string;
  points: number;
  solves: number;
  attachments: string[];
  solved: boolean;
};
