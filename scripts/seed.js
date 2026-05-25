require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const USERS_DIR = path.join(__dirname, '../public/images/users');
const MOVIES_DIR = path.join(__dirname, '../public/images/movies');

const userImages = {
  alex:    '1770333117718-boy1.jpg',
  marcus:  '1770248776944-boy2.jpg',
  kai:     '1770249254813-boy3.jpg',
  james:   '1770333289618-boy5.jpg',
  sam:     '1770108940381-boy6.jpg',
  sophie:  '1769910928796-girl1.jpg',
  mia:     '1770155504683-girl4.jpg',
  zoe:     '1770076447174-girl5.jpg',
};

const movieImages = {
  goodfellas:       '1770333154763-goodfellas.jpg',
  jurassic:         '1770333032295-jurasic.jpg',
  memento:          '1769912292154-memento.jpg',
  moulin:           '1769912610847-moulin-rouge.jpg',
  schindler:        '1769912403110-schindler.jpg',
  spiderman:        '1769912074046-spider-man.jpg',
  spirited:         '1769912890643-spirited-away.jpg',
  godfather:        '1769912801637-the-godfather-part2.jpg',
  virginSuicides:   '1769912502926-the-virgin-suicides.jpg',
  toyStory:         '1770153135250-toy-story.jpg',
};

async function upload(filePath, folder) {
  const result = await cloudinary.uploader.upload(filePath, { folder: `film-buff/${folder}` });
  return result.secure_url;
}

async function main() {
  console.log('Subiendo imágenes a Cloudinary...\n');

  const userUrls = {};
  for (const [key, file] of Object.entries(userImages)) {
    process.stdout.write(`  ${key}... `);
    userUrls[key] = await upload(path.join(USERS_DIR, file), 'users');
    console.log('ok');
  }

  const movieUrls = {};
  for (const [key, file] of Object.entries(movieImages)) {
    process.stdout.write(`  ${key}... `);
    movieUrls[key] = await upload(path.join(MOVIES_DIR, file), 'movies');
    console.log('ok');
  }

  const password = await bcrypt.hash('Password1!', 8);

  const users = [
    { name: 'Alex',   last: 'Torres',   email: 'alex@filmbuff.com',   desc: 'Sci-fi and thriller fanatic.',       avatar: userUrls.alex   },
    { name: 'Marcus', last: 'Webb',      email: 'marcus@filmbuff.com', desc: 'Classic cinema lover.',             avatar: userUrls.marcus  },
    { name: 'Kai',    last: 'Nakamura',  email: 'kai@filmbuff.com',    desc: 'Anime and Asian cinema enthusiast.',avatar: userUrls.kai     },
    { name: 'James',  last: 'Rivera',    email: 'james@filmbuff.com',  desc: 'Action movies all the way.',        avatar: userUrls.james   },
    { name: 'Sam',    last: 'Chen',      email: 'sam@filmbuff.com',    desc: 'Horror and suspense addict.',       avatar: userUrls.sam     },
    { name: 'Sophie', last: 'Laurent',   email: 'sophie@filmbuff.com', desc: 'French and European cinema fan.',   avatar: userUrls.sophie  },
    { name: 'Mia',    last: 'Reyes',     email: 'mia@filmbuff.com',    desc: 'Drama and romance are my thing.',   avatar: userUrls.mia     },
    { name: 'Zoe',    last: 'Park',      email: 'zoe@filmbuff.com',    desc: 'Indie films and hidden gems.',      avatar: userUrls.zoe     },
  ];

  // user_id: alex=1, marcus=2, kai=3, james=4, sam=5, sophie=6, mia=7, zoe=8
  const movies = [
    { user_id: 1, title: 'Goodfellas',               review: 'A masterpiece of crime cinema. Scorsese at his finest.', rating: 5, format: 'Blu-ray', year: 1990, poster: movieUrls.goodfellas     },
    { user_id: 1, title: 'Memento',                  review: 'Mind-bending noir. Watch it twice.',                     rating: 5, format: 'DVD',     year: 2000, poster: movieUrls.memento       },
    { user_id: 2, title: 'The Godfather Part II',    review: 'Possibly the greatest sequel ever made.',                rating: 5, format: 'Blu-ray', year: 1974, poster: movieUrls.godfather      },
    { user_id: 2, title: "Schindler's List",         review: 'Devastating and essential. Spielberg\'s best.',          rating: 5, format: 'Blu-ray', year: 1993, poster: movieUrls.schindler      },
    { user_id: 3, title: 'Spirited Away',            review: 'Miyazaki\'s most imaginative world. Pure magic.',        rating: 5, format: 'Blu-ray', year: 2001, poster: movieUrls.spirited       },
    { user_id: 3, title: 'Jurassic Park',            review: 'Still holds up. The benchmark for blockbuster cinema.',  rating: 5, format: 'Blu-ray', year: 1993, poster: movieUrls.jurassic       },
    { user_id: 4, title: 'Spider-Man: Into the Spider-Verse', review: 'Visually groundbreaking. Best animated film of the decade.', rating: 5, format: 'Digital', year: 2018, poster: movieUrls.spiderman },
    { user_id: 5, title: 'Toy Story',                review: 'The film that started it all. Timeless.',               rating: 5, format: 'DVD',     year: 1995, poster: movieUrls.toyStory       },
    { user_id: 6, title: 'Moulin Rouge!',            review: 'Visually intoxicating. A love letter to Paris.',         rating: 4, format: 'DVD',     year: 2001, poster: movieUrls.moulin         },
    { user_id: 7, title: 'The Virgin Suicides',      review: 'Haunting and dreamlike. Sofia Coppola\'s debut.',        rating: 4, format: 'DVD',     year: 1999, poster: movieUrls.virginSuicides },
  ];

  console.log('\n-- PEGA ESTE SQL EN MYSQL WORKBENCH (Railway) --\n');

  for (const u of users) {
    console.log(`INSERT INTO user (user_name, last_name, email, description, password, avatar) VALUES ('${u.name}', '${u.last}', '${u.email}', '${u.desc}', '${password}', '${u.avatar}');`);
  }

  console.log('');

  for (const m of movies) {
    console.log(`INSERT INTO film (user_id, title, review, rating, format, release_year, poster) VALUES (${m.user_id}, '${m.title}', '${m.review}', ${m.rating}, '${m.format}', ${m.year}, '${m.poster}');`);
  }

  console.log('\n-- FIN --');
}

main().catch(console.error);
