import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const schema = z.object({
  email: z.string().email('Enter a valid college email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export default function Login() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = login(data.email, data.password)
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`)
      navigate(from, { replace: true })
    } else {
      toast.error(result.error)
    }
  }

  const fillDemo = (role) => {
    const demos = {
      student: { email: 'arjun.verma@kiet.edu', password: 'pass1' },
      organizer: { email: 'priya.singh@kiet.edu', password: 'pass1' },
      admin: { email: 'admin@kiet.edu', password: 'pass1' },
    }
    setValue('email', demos[role].email)
    setValue('password', demos[role].password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-blue-600 p-16 text-white">
        <div className="max-w-md">
          <img src="https://kiet.edu/_next/image/?url=%2Fassets%2Fimages%2Flogo%2Fdark_logo.webp&w=256&q=75" alt="KIET" className="h-12 w-auto object-contain mb-8 brightness-0 invert" />
          <h1 className="text-4xl font-bold mb-4">KIET Events</h1>
          <p className="text-blue-100 text-lg leading-relaxed">Discover TechFest, Umang, ICICS and 50+ events at KIET Deemed to be University, Ghaziabad. NAAC A+ | NBA Accredited.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[['50+', 'Events'], ['8+', 'Clubs'], ['10k+', 'Students'], ['8+', 'Venues']].map(([n, l]) => (
              <div key={l} className="bg-white/10 rounded-2xl p-4">
                <p className="text-3xl font-bold">{n}</p>
                <p className="text-blue-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img src="https://kiet.edu/_next/image/?url=%2Fassets%2Fimages%2Flogo%2FKIET-Logo.webp&w=256&q=75" alt="KIET" className="h-8 w-auto object-contain" />
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1">Sign in with your KIET email</p>
          </div>

          {/* Demo quick-fill */}
          <div className="flex gap-2 mb-6">
            {[['student', '🎓'], ['organizer', '🎯'], ['admin', '⚙️']].map(([role, icon]) => (
              <button key={role} onClick={() => fillDemo(role)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 rounded-lg transition-colors capitalize">
                {icon} {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mb-6">↑ Click to auto-fill demo credentials</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="KIET Email" type="email" placeholder="you@kiet.edu" error={errors.email?.message} {...register('email')} />
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••" error={errors.password?.message} {...register('password')} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline self-end">Forgot password?</Link>
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center">Sign In</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
