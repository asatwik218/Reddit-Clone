"use client";
import { authModalState } from "@/atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/utils/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { communityId } = useParams();

  const onJoinLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    //if user not signed in open auth modal
    if (!user) {
      //open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData);
      return;
    } else {
      joinCommunity(communityData);
      return;
    }
  };

  const getMySnippets = async () => {
    setLoading(true);

    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched:true,
      }));
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    //batch writes
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator:user?.uid === communityData.createrId,
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      //update recoil state
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.error("joinCommunityError", error);
      setError(error.message);
    }
  };

  const leaveCommunity = async (communityData: Community) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id)
      );
      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      //update recoil state
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId != communityData.id
        ),
      }));
    } catch (error: any) {
      console.error("leave Community error", error);
      setError(error.message);
    }
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
  };

  useEffect(() => {
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId);
    }
  }, [communityId, communityStateValue.currentCommunity]);

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched:false, 
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading,
    error,
  };
};
export default useCommunityData;
