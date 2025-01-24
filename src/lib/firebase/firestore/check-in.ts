import { z } from "zod";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  type FirestoreDataConverter,
} from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { firebaseDb } from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CheckInSchema = z.object({
  userId: z.string(),
  timestamp: z.string().datetime(),
  imageSrc: z.string()
});

export type CheckIn = z.infer<typeof CheckInSchema>

export const checkInConverter: FirestoreDataConverter<CheckIn> = {
  toFirestore(checkIn) {
    return {
      userId: checkIn.userId,
      timestamp: checkIn.timestamp,
      imageSrc: checkIn.imageSrc
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return CheckInSchema.parse({
      userId: data.userId as unknown,
      timestamp: data.timestamp as unknown,
      imageSrc: data.imageSrc as unknown
    });
  },
};

// export const fetchCollection = async (collectionName) => {
//   const querySnapshot = await onSnapshot();
//   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

export const useUserCheckInsSubscription = (args: { userId?: string | null }) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => [
      "users",
      {
        userId: args.userId,
      },
      "check-ins",
    ],
    [args.userId],
  );

  useEffect(() => {
    if (!args.userId) {
      return;
    }

    const unsub = onSnapshot(
      collection(firebaseDb, "users", args.userId, "check-ins"),
      (doc) => {
        // const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        // console.log(source, " data: ", doc.data());
        // queryClient.setQueryData(['check-ins', args.userId], doc.data())
        console.log(doc)

        void queryClient.invalidateQueries({
          queryKey,
        });
      },
    );

    return () => {
      unsub();
    };
  }, [args.userId, queryKey]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!args.userId) {
        return null
      }
      const UserCheckInsRef = collection(
        firebaseDb,
        "users",
        args.userId,
        "check-ins",
      )
      .withConverter(checkInConverter);

      const checkIns: (CheckIn & {
        id: string
      })[] = [];

      const querySnapshot = await getDocs(query(UserCheckInsRef));
      querySnapshot.forEach(doc => {
        const data = doc.data();
        checkIns.push({
          id: doc.id,
          userId: data.userId,
          timestamp: data.timestamp,
          imageSrc: data.imageSrc
        })
      });

      return checkIns
    },
    enabled: Boolean(args.userId)
    // onSuccess: (data) => {
    //   queryClient.setQueryData(['check-ins', args.userId], data)
    // }
  });
};

export const useUserCheckInMutation = () => {
  return useMutation({
    mutationFn: (args: { userId: string, imageSrc: string }) => {
      const UserCheckInsRef = collection(
        firebaseDb,
        "users",
        args.userId,
        "check-ins",
      )
      .withConverter(checkInConverter);
  
      return addDoc((UserCheckInsRef), {
        userId: args.userId,
        imageSrc: args.imageSrc,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error) => {
      console.error(error)
    }
  })
}