import {
  collection, getDocs, doc, updateDoc, getDoc,
  query, where, setDoc, serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const getPendingAdmins = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'admin'),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getPendingAdmins:', err.code, err.message);
    return [];
  }
};

// Write approval action to a separate 'adminActions' collection
// which has open write rules, then update the user doc
export const approveAdmin = async (uid) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  // Log the action
  await setDoc(doc(db, 'adminActions', `${user.uid}_approve_${uid}`), {
    action: 'approve',
    targetUid: uid,
    performedBy: user.uid,
    performedAt: serverTimestamp(),
  });

  // Update the target user's status
  await updateDoc(doc(db, 'users', uid), {
    status: 'approved',
    approvedBy: user.uid,
    approvedAt: new Date().toISOString(),
  });
};

export const rejectAdmin = async (uid) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  await setDoc(doc(db, 'adminActions', `${user.uid}_reject_${uid}`), {
    action: 'reject',
    targetUid: uid,
    performedBy: user.uid,
    performedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'users', uid), {
    role: 'user',
    status: 'approved',
    rejectedBy: user.uid,
    rejectedAt: new Date().toISOString(),
  });
};
