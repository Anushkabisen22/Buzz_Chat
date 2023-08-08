import React,{useState} from 'react'
import { FormControl, FormLabel, VStack,Input ,Button,useToast} from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function SignUp() {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [loading, setloading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const postDetails=(pict)=>{
           setloading(true);
           if(pict===undefined){
              toast({
                title:"Select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'bottom'
              });
              return;
           }
           if(pict.type==="image/png" || pict.type==="image/jpeg"){
                const Data=new FormData();
                Data.append("file",pict);
                Data.append("upload_preset","BuzzChat");
                Data.append("cloud_name","dm87q7aan");
                fetch("https://api.cloudinary.com/v1_1/dm87q7aan/image/upload",{
                  method:'post',
                  body:Data,
                }).then((res)=>res.json())
                .then(Data=>{
                  setPic(Data.url.toString());
                  console.log(Data.url.toString());
                  setloading(false);

                })
                .catch((err)=>{
                  console.log(err);
                  setloading(false);
                });
           }
           else{
               toast({
                title:"Select an image",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'bottom'
              });
              setloading(false);
              // history.push('./chats');
           }
    };
    const handelClick=async ()=>{
            //  console.log('clickex');
             setloading(true);
             if(!Name || !Email || !Password){
                toast({
                title:"Fill all the details",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'bottom'
              });
              setloading(false);
              return;
             }
             console.log(Name,Email,Password,pic);
             try {
               const config={
                headers:{
                  "Content-type":"application/json", 
                }
               }
               const {data}=await axios.post('/api/user/register',{name:Name,email:Email,password:Password,pic:pic},config);
               console.log(data);
               localStorage.setItem("userInfo",JSON.stringify(data));
               navigate('/chats');
               setloading(false);
             } catch (error) {
                 toast({
                title:"Error",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:'bottom'
              });
              setloading(false);
             }
            
    };
  return (
    <VStack spacing='3px'>
  <FormControl>
  <FormLabel>Name</FormLabel>
  <Input onChange={(e)=>{setName(e.target.value)}} type='text' />
  <FormLabel>Email</FormLabel>
  <Input onChange={(e)=>{setEmail(e.target.value)}} type='email' />
   <FormLabel>Password</FormLabel>
  <Input onChange={(e)=>{setPassword(e.target.value)}} type='password' />
   <FormLabel>Profile Picture</FormLabel>
  <Input onChange={(e)=>postDetails(e.target.files[0])} type='file' accept='image/*' p={1.5}  />
 
  </FormControl>
<Button colorScheme='teal' width='100%' mt={15} size='md' isLoading={loading} onClick={handelClick} >
    SignUp
</Button>
    </VStack>
  )
}
