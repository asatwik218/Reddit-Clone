
import { Community } from "@/atoms/communitiesAtom";
import Header from "@/components/community/Header";
import { firestore } from "@/utils/firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { FC, useState } from "react";
import PageContent from "@/components/layout/PageContent";
import CreatePostLink from "@/components/community/CreatePostLink";
import Posts from "@/components/posts/Posts";
import About from "@/components/community/About";

interface CommunityPageProps {
  params: {
    communityId: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(firestore, "communities"));
  let docIds: string[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    docIds.push(doc.id);
  });

  return docIds.map((communityId) => ({
    communityId,
  }));
}

const CommunityPage = async ({ params }: CommunityPageProps) => {
  let communityData: Community | null = null;
  const communityDoc = await getDoc(
    doc(firestore, "communities", params.communityId)
  );
  if (!communityDoc.exists())
    throw new Error("Community by that name does not exist");

  communityData = JSON.parse(
    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
  );


  return (
    <div>
      {communityData && <Header communityData={communityData} />}
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData}/>
        </>
      </PageContent>
    </div>
  );
};

export default CommunityPage;
