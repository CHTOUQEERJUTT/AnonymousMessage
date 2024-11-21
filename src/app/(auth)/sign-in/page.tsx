"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
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
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import {signIn} from 'next-auth/react'
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"


function page() {
  const router  = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema)
  })
  const onSubmit = async function(data:z.infer<typeof signInSchema>){
    const result = await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,

    })
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }
    if (result?.url) {
      router.replace('/dashboard');
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800" >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username/Email</FormLabel>
              <FormControl>
                <Input placeholder="Username/Email" {...field} />
              </FormControl>
              
  
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              
  
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page