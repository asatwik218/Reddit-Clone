"use client";
import { Community } from "@/atoms/communitiesAtom";
import About from "@/components/community/About";
import CreatePostLink from "@/components/community/CreatePostLink";
import PageContent from "@/components/layout/PageContent";
import NewPostForm from "@/components/posts/NewPostForm";
import { auth, firestore } from "@/utils/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function SubmitPostPage() {
  const [user] = useAuthState(auth);
  const [communityData, setCommunityData] = useState<Community | null>(null);
  const { communityId } = useParams();
  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      if (!communityDoc.exists())
        throw new Error("Community by that name does not exist");

      setCommunityData({
        id: communityDoc.id,
        ...communityDoc.data(),
      } as Community);
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
  };

  useEffect(() => {
    if (communityId && !communityData) getCommunityData(communityId);
  }, [communityId]);

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text> Create a post </Text>
        </Box>
        {/* new post form   */}
        {user && <NewPostForm user={user} communityImageURL={communityData?.imageURL} />}
      </>
      <>
        {/* about */}
        <About communityData={communityData} />
      </>
    </PageContent>
  );
}

export default SubmitPostPage;
