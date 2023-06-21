import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  createrId: string;
  createdAt?: Timestamp;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community | null;
  snippetsFetched:boolean
}

const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched:false
};

export const communityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
