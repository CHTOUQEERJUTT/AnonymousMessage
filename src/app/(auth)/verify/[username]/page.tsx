'use client';

import axios,{AxiosError} from "axios"
import { useParams,useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useToast } from "@/hooks/use-toast"
import ApiResponse from "@/types/apiResponse";




function verify() {
  const params = useParams<{username:string}>();
  const router = useRouter()
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver:zodResolver(verifySchema)
  })
  const { toast } = useToast()

  const onSubmit = async function(data:z.infer<typeof verifySchema>){
    try {
      const response = axios.post<ApiResponse>('/verifycode',{
        username : params?.username,
        verifyCode:data?.verifyCode,
      })
      console.log(response);
      
      toast({
        title: 'Success',
        
      });
     
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }
  


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="verifyCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>VerifyCode</FormLabel>
              <FormControl>
                <Input placeholder="VerifyCode" {...field} />
              </FormControl>
            
            </FormItem>
          )}
        />
        <Button  type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default verify