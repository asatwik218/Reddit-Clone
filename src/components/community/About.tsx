"use client";
import { Community, communityState } from "@/atoms/communitiesAtom";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";

import useSelectFile from "@/hooks/useSelectFile";
import { auth, firestore, storage } from "@/utils/firebase/clientApp";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";

type AboutProps = {
  communityData?: Community | null;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const communityStateValue = useRecoilValue(communityState);

  const onImageUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const imageRef = ref(storage, `communities/${communityData?.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      if (communityData)
        await updateDoc(doc(firestore, "communities", communityData.id), {
          imageURL: downloadURL,
        });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("onImageUpload error: ", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!communityData) return;
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  return (
    <Box position="sticky">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="blue.400"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontWeight={600} fontSize="10pt">
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>21</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} mr={2} />
            {communityData?.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData?.createdAt?.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData?.id}/submit`}>
            <Button mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData?.createrId && (
            <>
              <Divider />
              <Stack fontSize="10pt" spacing={1}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      selectedFileRef.current?.click();
                    }}
                  >
                    Change Image
                  </Text>
                  {communityData?.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData?.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="community-image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (loading ? (
                    <Spinner />
                  ) : (
                    <Text
                      cursor="pointer"
                      onClick={() => {
                        onImageUpload();
                      }}
                    >
                      Save Changes
                    </Text>
                  ))}

                <input
                  ref={selectedFileRef}
                  type="file"
                  hidden
                  onChange={(e) => onSelectFile(e)}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
