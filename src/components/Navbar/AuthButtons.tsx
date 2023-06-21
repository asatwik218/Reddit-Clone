import { authModalState } from "@/atoms/authModalAtom";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";

const AuthButtons: React.FC = () => {

  
  const setAuthModalState = useSetRecoilState(authModalState);
  
  return (
    <>
      <Button
        variant="outline"
        height="30px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => setAuthModalState(() => ({ view:'login', open: true }))}
      >
        Login
      </Button>
      <Button
        variant="solid"
        height="30px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => setAuthModalState(() => ({ view:'signup', open: true }))}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
