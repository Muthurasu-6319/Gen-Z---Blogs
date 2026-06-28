export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  content: string;
  readingTime: string;
}

export interface Category {
  name: string;
  slug: string;
}
