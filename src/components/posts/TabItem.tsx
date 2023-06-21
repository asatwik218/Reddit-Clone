"use client";
import React from "react";
import { TabItemType } from "./NewPostForm";
import { Flex, Icon, Text } from "@chakra-ui/react";

type TabItemProps = {
  item: TabItemType;
  isSelected: boolean;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

const TabItem: React.FC<TabItemProps> = ({ item, isSelected , setSelectedTab}) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      color={isSelected ? "blue.500" : "gray.500"}
      borderWidth={isSelected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={isSelected ? "blue.500" : "gray.200"}
      borderRightRadius="gray.200"
      onClick={() => {setSelectedTab(item.title)}}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon as={item.icon} />
      </Flex>
      <Text fontSize="10pt">{item.title}</Text>
    </Flex>
  );
};
export default TabItem;
