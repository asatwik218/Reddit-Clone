import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/utils/firebase/clientApp";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import {FIREBASE_ERRORS} from '@/utils/firebase/errors';

const Signup: React.FC = () => {
  //recoil state for modal
  const setAuthModalState = useSetRecoilState(authModalState);

  //signup form state dont confuse with name
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  //error state
  const [error, setError] = useState("");

  //firebase create user hook from react-firebase-hooks
  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(error) setError("");

    if (loginForm.password !== loginForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(loginForm.email, loginForm.password);
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
        name="confirmPassword"
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
      <Input
        name="password"
        placeholder="confirm password..."
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

      {userError && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {error || FIREBASE_ERRORS[userError.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button type="submit" width="100%" height="36px" mb={2} mt={2} isLoading={loading}>
        Sign Up
      </Button>
      <Flex justify="center" fontSize="9pt">
        <Text mr={1}>Already a redditor? </Text>
        <Text
          color="blue.500"
          cursor="pointer"
          fontWeight={700}
          mb={2}
          onClick={() => {
            setAuthModalState((prev) => ({ ...prev, view: "login" }));
          }}
        >
          LOGIN
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
