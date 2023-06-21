import { authModalState } from "@/atoms/authModalAtom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/utils/firebase/errors";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  return (
    <form onSubmit={onSubmit}>
      <Input
        name="email"
        placeholder="email..."
        type="email"
        mb={2}
        onChange={onChange}
        required
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
          bg: "white",
        }}
        bg="gray.50"
      />
      <Input
        name="password"
        placeholder="password..."
        type="password"
        mb={2}
        onChange={onChange}
        required
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
          bg: "white",
        }}
        bg="gray.50"
      />
      {error && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {
            FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button type="submit" width="100%" height="36px" mb={2} mt={2} isLoading={loading}>
        Login
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() =>  setAuthModalState((prev) => ({ ...prev, view: "resetPassword" }))}
        >
          Reset
        </Text>
      </Flex>
      <Flex justify="center" fontSize="9pt">
        <Text mr={1}>New Here?</Text>
        <Text
          color="blue.500"
          cursor="pointer"
          fontWeight={700}
          mb={2}
          onClick={() => {
            setAuthModalState((prev) => ({ ...prev, view: "signup" }));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
