export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  isLoanedBook?: boolean;
  createdAt: Date | null;
  language: Language;
}

export interface AuthCredentials {
  name: string;
  email: string;
  password: string;
  credentialId: string;
  credentialCard: string;
}

export interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
  language: Language;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
