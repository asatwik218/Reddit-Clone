"use client";
import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsAtom";
import About from "@/components/community/About";
import PageContent from "@/components/layout/PageContent";
import PostItem from "@/components/posts/PostItem";
import Comments from "@/components/posts/comments/Comments";
import usePosts from "@/hooks/usePosts";
import { auth, firestore } from "@/utils/firebase/clientApp";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiCommentMinus } from "react-icons/bi";

const PostPage: React.FC = () => {
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { communityId, pid } = useParams();
  const [communityData, setCommunityData] = useState<Community | null>(null);

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
  };

  useEffect(() => {
    if (pid && !postStateValue.selectedPost) fetchPost(pid);
  }, [pid, postStateValue.selectedPost]);

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
        {/* selected Post */}
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}

        {/* comments */}
        <Comments user={user as User} selectedPost={postStateValue.selectedPost} communityId={postStateValue.selectedPost?.communityId as string}/>
      </>
      <>
        {/* about */}
        <About communityData={communityData} />
      </>
    </PageContent>
  );
};
export default PostPage;
