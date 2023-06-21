"use client";
import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsAtom";
import usePosts from "@/hooks/usePosts";
import { auth, firestore } from "@/utils/firebase/clientApp";
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostsLoader from "./PostsLoader";

type PostsProps = {
  communityData: Community | null;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData?.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <PostsLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => (
            <PostItem
              key={item.id}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={postStateValue.postVotes.find(vote => vote.postId === item.id)?.voteValue}
              post={item}
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
