import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Enter a valid college email'),
  department: z.string().min(1, 'Select your department'),
  year: z.string().min(1, 'Select your year'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

const DEPARTMENTS = [
  'CSE', 'CSE – AI & ML', 'CSE – Data Science', 'CSE – Cyber Security',
  'ECE', 'EEE', 'ELCE', 'IT', 'ME', 'VLSI',
  'MCA', 'MBA', 'B. Pharmacy', 'D. Pharmacy',
]

export default function Register() {
  const { register: reg } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const { confirmPassword, ...rest } = data
    const result = reg({ ...rest, year: parseInt(rest.year) })
    setLoading(false)
    if (result.success) {
      toast.success('Account created! Welcome to KIET Events 🎉')
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src="https://kiet.edu/_next/image/?url=%2Fassets%2Fimages%2Flogo%2FKIET-Logo.webp&w=256&q=75" alt="KIET" className="h-8 w-auto object-contain" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Create your KIET account</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">Use your @kiet.edu email to join</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Your full name" error={errors.name?.message} {...register('name')} />
          <Input label="KIET Email" type="email" placeholder="you@kiet.edu" error={errors.email?.message} {...register('email')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" error={errors.department?.message} {...register('department')}>
              <option value="">Select dept.</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select label="Year" error={errors.year?.message} {...register('year')}>
              <option value="">Year</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              <option value="5">PG</option>
            </Select>
          </div>
          <Input label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <Button type="submit" loading={loading} className="w-full justify-center mt-2">Create Account</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        