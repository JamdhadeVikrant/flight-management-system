import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const FLIGHTS = 'flights';

export const addFlight = (data) =>
  addDoc(collection(db, FLIGHTS), { ...data, createdAt: serverTimestamp() });

export const getFlights = async () => {
  const snap = await getDocs(query(collection(db, FLIGHTS), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const searchFlights = async (from, to, date) => {
  const q = query(
    collection(db, FLIGHTS),
    where('from', '==', from),
    where('to', '==', to),
    where('date', '==', date)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateFlight = (id, data) =>
  updateDoc(doc(db, FLIGHTS, id), data);

export const deleteFlight = (id) =>
  deleteDoc(doc(db, FLIGHTS, id));
