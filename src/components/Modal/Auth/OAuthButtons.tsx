import { auth } from '@/utils/firebase/clientApp';
import { Button, Flex , Image, Text} from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';


type OAuthButtonsProps = {
};

const OAuthButtons:React.FC<OAuthButtonsProps> = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    
    return <Flex width='100%' >
        <Button width='100%' variant='oauth' mb={2} onClick={()=>{signInWithGoogle()}} isLoading={loading}>
            <Image src='/images/googlelogo.png' height='17px' mr={4}/>
            continue with Google</Button>
            {error &&<Text>{error.message}</Text>}
    </Flex>
}
export default OAuthButtons;