import { authModalState } from '@/atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import { Sign } from 'crypto';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';

type AuthInputsProps = {
    
};

const AuthInputs:React.FC<AuthInputsProps> = () => {
    const AuthModalState = useRecoilValue(authModalState);

    return <Flex direction='column' align='center' width='100%' mt={4}>

        {AuthModalState.view === 'login' && <Login/>}
        {AuthModalState.view === 'signup' && <Signup/>}
        {AuthModalState.view === 'resetPassword' && <ResetPassword/>}

    </Flex>
}
export default AuthInputs;