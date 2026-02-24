'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, EyeOff, Globe, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

import Image from 'next/image'
import { toast } from 'sonner'

const formSchema = z.object({
  language: z.string().min(1, {
    message: 'Please select a language.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
})

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'english',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const res = await signIn('credentials', {
        email: values?.email,
        password: values?.password,
        redirect: false,
      })

      if (res?.error) {
        if (res.error === 'INVALID_CREDENTIALS') {
          toast.error('Email or Password wrong')
          return
        }

        toast.error(res.error || 'Login failed')
        return
      }

      toast.success('Login successful!')
      window.location.href = '/dashboard'

    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="w-full md:w-[479px] bg-white rounded-[16px] border-[2px] border-[#E7E7E7] shadow-[0px_0px_10px_0px_#0000001A] p-6">
        <div className="w-full flex items-center justify-center pb-6">
          <Link href="/">
            <Image
              src="/images/auth_logo.png"
              alt="auth logo"
              width={500}
              height={500}
              className="w-[260px] h-[79px] object-contain"
            />
          </Link>
        </div>

        <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold text-[#00253E] text-left leading-[120%] ">
          Sign in to Insight Engine
        </h3>
        <p className="text-base font-normal text-[#666666] leading-[150%] text-left pt-1">
          Access your change communication workspace
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 pt-5 md:pt-6 lg:pt-8"
          >
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg md:text-xl lg:text-2xl font-medium text-[#001B31]">
                    <Globe className="inline mr-1 -mt-1 w-6 h-6 text-[#00253E]" />{' '}
                    Language
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-[48px] rounded-[8px] border border-[#6C6C6C] px-4 text-base">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="germany">German</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg md:text-xl lg:text-2xl font-medium text-[#001B31]">
                    <Mail className="inline mr-1 -mt-1 w-6 h-6 text-[#00253E]" />{' '}
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[48px] text-base font-medium leading-[120%] text-black rounded-[8px] outline-none p-4 border border-[#6C6C6C] placeholder:text-[#666666]"
                      placeholder="name@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg md:text-xl lg:text-2xl font-medium text-[#001B31] ">
                    <LockKeyhole className="inline mr-1 -mt-1 w-6 h-6 text-[#00253E]" />{' '}
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full h-[48px] text-base font-medium leading-[120%] text-black rounded-[8px] outline-none p-4 border border-[#6C6C6C] placeholder:text-[#666666]"
                        placeholder="*******"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3.5 right-4"
                      >
                        {showPassword ? (
                          <Eye onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <Link
                className="text-base font-normal text-primary cursor-pointer leading-[120%] hover:underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-3">
              <Button
                disabled={isLoading}
                className={`text-base font-medium text-[#00253E] cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[50px] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-primary'
                  }`}
                type="submit"
              >
                {isLoading ? 'Sign In ...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default LoginForm
