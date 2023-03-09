// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set, onValue } from 'firebase/database';
import { movieDetailType, movieType } from '../types/movieType';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DB_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
//현재 로그인한 유저
export let currentUser: string | undefined = auth.currentUser?.uid;

//로그인
export async function logIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      console.log(error);
    });
}

//로그아웃
export async function logOut() {
  signOut(auth)
    .then(() => null)
    .catch((error) => {
      console.log(error);
    });
}

export function onUserStateChange(callback: any) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user?.uid;
    // const updateUser = user ? await pickDB(user) : null;
    callback(user);
  });
}

export async function addMovies(movieList: any) {
  const myObject: { [key: number]: movieType } = {};
  movieList.forEach((item: any) => {
    myObject[item.id] = item;
  });
  return set(ref(database, `movies/`), {
    ...myObject,
  });
}

export async function getMovies() {
  return get(ref(database, 'movies')).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  });
}

// export async function addMovieDetail(movieId: number, movieDetail: movieDetailType | undefined) {
//   return set(ref(database, `admins/${currentUser}/${movieId}`), {
//     ...movieDetail,
//   });
// }

// export async function getMovieDetail(
//   movieId: number,
//   movieDetail: movieDetailType | undefined,
//   state: boolean
// ) {
//   return get(ref(database, `admins/${currentUser}/${movieId}`)).then((snapshot) => {
//     if (snapshot.exists()) {
//       console.log(snapshot.val().pick);
//       return snapshot.val().pick;
//     }
//     return set(ref(database, `admins/${currentUser}/${movieId}`), {
//       ...movieDetail,
//       pick: state,
//     });
//   });
// }

export async function getPickDB(movieId: number | undefined) {
  return await get(ref(database, `admins/${currentUser}/${movieId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.val();
    }
  });
}

// export async function getPickDB(movieId: number) {
//   return get(ref(database, `admins/${currentUser}/${movieId}`)).then((snapshot) => {
//     if (snapshot.exists()) {
//       console.log('11');
//       console.log(snapshot.val());
//       return snapshot.val();
//     }
//     console.log('22');
//     return false;
//   });
// }

// //firebase set data
export async function setPickDB(
  movieId: number,
  movieDetail: movieDetailType | undefined,
  state: boolean
) {
  return set(ref(database, `admins/${currentUser}/${movieId}`), {
    ...movieDetail,
    userMovieState: {
      pick: state,
    },
  });
}
