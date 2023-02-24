// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { title } from 'process';
import { v4 as uuid } from 'uuid';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DB_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const database = getDatabase(app);
//현재 로그인한 유저
let currentUser: string | undefined = auth.currentUser?.uid;

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

export async function addMovies(movieId: any, movieList: any) {
  // const list = movieList.map(({ id, ...item }: any) => id);

  const myObject: { [key: number]: any } = {};

  movieList.forEach((item: any) => {
    myObject[item.id] = item;
  });

  // console.log(movieList);
  return set(ref(database, `moives/`), {
    ...myObject,
  });
}

// id: list,
export async function getPickDB(user: any) {
  return get(ref(database, `admins/${currentUser}`)) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
        const admins = snapshot.val();
        console.log(admins);
        console.log(user);
        const isAdmin = admins.includes(user);
        console.log(isAdmin);
        // console.log(admins);
      }
    });
}

//firebase set data
export async function setPickDB(movieId: number, pickState: any) {
  return set(ref(database, `admins/${currentUser}/${movieId}`), {
    pick: pickState,
  }); //
}
