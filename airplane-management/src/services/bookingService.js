import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, where, serverTimestamp, getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const BOOKINGS = 'bookings';

export const createBooking = async (bookingData) => {
  const ref = await addDoc(collection(db, BOOKINGS), {
    ...bookingData,
    status: 'confirmed',
    bookedAt: serverTimestamp(),
  });
  // Decrement available seats
  const flightRef = doc(db, 'flights', bookingData.flightId);
  const flightSnap = await getDoc(flightRef);
  if (flightSnap.exists()) {
    const seats = flightSnap.data().availableSeats - 1;
    await updateDoc(flightRef, { availableSeats: Math.max(0, seats) });
  }
  return ref;
};

export const getUserBookings = async (userId) => {
  const q = query(collection(db, BOOKINGS), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllBookings = async () => {
  const snap = await getDocs(collection(db, BOOKINGS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const cancelBooking = async (bookingId, flightId) => {
  await updateDoc(doc(db, BOOKINGS, bookingId), { status: 'cancelled' });
  // Restore seat
  const flightRef = doc(db, 'flights', flightId);
  const flightSnap = await getDoc(flightRef);
  if (flightSnap.exists()) {
    const seats = flightSnap.data().availableSeats + 1;
    await updateDoc(flightRef, { availableSeats: seats });
  }
};
