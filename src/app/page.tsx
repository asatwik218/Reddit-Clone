"use client";
import { communityState } from "@/atoms/communitiesAtom";
import { Post, PostVote } from "@/atoms/postsAtom";
import PageContent from "@/components/layout/PageContent";
import PostLoader from "@/components/posts/PostsLoader";
import usePosts from "@/hooks/usePosts";
import { auth, firestore } from "@/utils/firebase/clientApp";
import { Stack } from "@chakra-ui/react";
import { log } from "console";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import PostItem from "@/components/posts/PostItem";
import CreatePostLink from "@/components/community/CreatePostLink";
import useCommunityData from "@/hooks/useCommunityData";
import Recommendations from "@/components/community/Recommendations";
import PersonalHome from "@/components/community/PersonalHome";
import Premium from "@/components/community/Premium";

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();
  const { communityStateValue } = useCommunityData();

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      //setPostState

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("buildUserHomeFeed error", error.message);
    }
    setLoading(false);
  };

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        const myCommuityIds = communityStateValue.mySnippets.map(
          (item) => item.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommuityIds),
          limit(10)
        );
        const postDoc = await getDocs(postQuery);
        const posts = postDoc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log("buildUserHomeFeed error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    setLoading(true);
    try {
      const postIds = postStateValue.posts.map((item) => item.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVotesDocs = await getDocs(postVotesQuery);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.log("getUserPostVotes error", error.message);
    }
    setLoading(false);
  };

  // useEffects
  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find((item) => item.id === post.id)
                    ?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage={true}
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        {/* Recommendations */}
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
}
