import {
  BookCopy,
  BookMarked,
  Home,
  LucideIcon,
  UserPlus,
  Users,
} from "lucide-react";

export const LANGUAGES = ["en", "es", "fr", "de", "it", "pt"] as const;
export type Language = (typeof LANGUAGES)[number];

export interface AdminSideBarLink {
  icon: LucideIcon;
  url: string;
  name: string;
}

export const navigationLinks = [
  {
    href: "/library",
    label: "Library",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks: AdminSideBarLink[] = [
  {
    icon: Home,
    url: "/admin",
    name: "Inicio",
  },
  {
    icon: Users,
    url: "/admin/users",
    name: "Usuarios",
  },
  {
    icon: BookCopy,
    url: "/admin/books",
    name: "Catálogo de libros",
  },
  {
    icon: BookMarked,
    url: "/admin/book-requests",
    name: "Solicitudes de préstamo",
  },
  {
    icon: UserPlus,
    url: "/admin/account-requests",
    name: "Solicitudes de registro",
  },
];

export const FIELD_NAMES = {
  name: "Nombre Completo",
  email: "Correo Electrónico",
  credentialId: "Número de Credencial",
  password: "Contraseña",
  confirmPassword: "Confirmar Contraseña",
  credentialCard: "Subir Documento",
};

export const FIELD_TYPES = {
  name: "text",
  email: "email",
  credentialId: "text",
  password: "password",
  confirmPassword: "password",
};

export const sampleBooks = [
  {
    id: "1",
    title: "La Biblioteca de la Medianoche",
    author: "Matt Haig",
    genre: "Fantasía / Ficción",
    rating: 4.6,
    totalCopies: 20,
    availableCopies: 10,
    description:
      "Una deslumbrante novela sobre todas las decisiones que conforman una vida bien vivida. La Biblioteca de la Medianoche cuenta la historia de Nora Seed mientras se encuentra entre la vida y la muerte.",
    coverColor: "#1c1f40",
    coverUrl: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Una deslumbrante novela sobre todas las decisiones que conforman una vida bien vivida. La Biblioteca de la Medianoche cuenta la historia de Nora Seed mientras se encuentra entre la vida y la muerte.",
    isLoanedBook: true,
    language: "en",
  },
  {
    id: 2,
    title: "Hábitos Atómicos",
    author: "James Clear",
    genre: "Autoayuda / Productividad",
    rating: 4.9,
    totalCopies: 99,
    availableCopies: 50,
    description:
      "Una guía revolucionaria para crear buenos hábitos, romper los malos y mejorar un 1% cada día.",
    coverColor: "#fffdf6",
    coverUrl: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Una guía revolucionaria para crear buenos hábitos, romper los malos y mejorar un 1% cada día.",
    language: "en",
  },
  {
    id: 3,
    title: "You Don't Know JS: Alcance y Clausuras",
    author: "Kyle Simpson",
    genre: "Ciencias de la Computación / JavaScript",
    rating: 4.7,
    totalCopies: 9,
    availableCopies: 5,
    description:
      "Una guía esencial para comprender los mecanismos fundamentales de JavaScript, centrada en el alcance y las clausuras.",
    coverColor: "#f8e036",
    coverUrl:
      "https://m.media-amazon.com/images/I/7186YfjgHHL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Una guía esencial para comprender los mecanismos fundamentales de JavaScript, centrada en el alcance y las clausuras.",
    language: "en",
  },
  {
    id: 4,
    title: "El Alquimista",
    author: "Paulo Coelho",
    genre: "Filosofía / Aventura",
    rating: 4.5,
    totalCopies: 78,
    availableCopies: 50,
    description:
      "Un cuento mágico sobre Santiago, un pastor andaluz que emprende un viaje en busca de un tesoro terrenal.",
    coverColor: "#ed6322",
    coverUrl:
      "https://m.media-amazon.com/images/I/61HAE8zahLL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Un cuento mágico sobre Santiago, un pastor andaluz que emprende un viaje en busca de un tesoro terrenal.",
    language: "en",
  },
  {
    id: 5,
    title: "Trabajo Profundo",
    author: "Cal Newport",
    genre: "Autoayuda / Productividad",
    rating: 4.7,
    totalCopies: 23,
    availableCopies: 23,
    description:
      "Reglas para el éxito enfocado en un mundo lleno de distracciones, enseñando cómo cultivar una concentración profunda para lograr la máxima productividad.",
    coverColor: "#ffffff",
    coverUrl: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Reglas para el éxito enfocado en un mundo lleno de distracciones, enseñando cómo cultivar una concentración profunda para lograr la máxima productividad.",
    language: "en",
  },
  {
    id: 6,
    title: "Código Limpio",
    author: "Robert C. Martin",
    genre: "Ciencias de la Computación / Programación",
    rating: 4.8,
    totalCopies: 56,
    availableCopies: 56,
    description:
      "Un manual de artesanía de software ágil, que ofrece las mejores prácticas y principios para escribir código limpio y mantenible.",
    coverColor: "#080c0d",
    coverUrl:
      "https://m.media-amazon.com/images/I/71T7aD3EOTL._UF1000,1000_QL80_.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Un manual de artesanía de software ágil, que ofrece las mejores prácticas y principios para escribir código limpio y mantenible.",
    language: "en",
  },
  {
    id: 7,
    title: "El Programador Pragmático",
    author: "Andrew Hunt, David Thomas",
    genre: "Ciencias de la Computación / Programación",
    rating: 4.8,
    totalCopies: 25,
    availableCopies: 3,
    description:
      "Una guía atemporal para que los desarrolladores perfeccionen sus habilidades y mejoren sus prácticas de programación.",
    coverColor: "#100f15",
    coverUrl:
      "https://m.media-amazon.com/images/I/71VStSjZmpL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Una guía atemporal para que los desarrolladores perfeccionen sus habilidades y mejoren sus prácticas de programación.",
    language: "en",
  },
  {
    id: 8,
    title: "La Psicología del Dinero",
    author: "Morgan Housel",
    genre: "Finanzas / Autoayuda",
    rating: 4.8,
    totalCopies: 10,
    availableCopies: 5,
    description:
      "Morgan Housel explora los comportamientos y mentalidades únicas que moldean el éxito financiero y la toma de decisiones.",
    coverColor: "#ffffff",
    coverUrl:
      "https://m.media-amazon.com/images/I/81Dky+tD+pL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "/sample-videoUrl.mp4?updatedAt=1722593504152",
    summary:
      "Morgan Housel explora los comportamientos y mentalidades únicas que moldean el éxito financiero y la toma de decisiones.",
    language: "en",
  },
];
