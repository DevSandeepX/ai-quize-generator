"use client"
import { actionToast } from '@/lib/actionToast'
import { createCategory, updateCategory } from '@/server/actions/category'
import { useRouter } from 'next/navigation'
import React from 'react'

interface CategoryFormProps {
    category?: {
        id: string,
        text: string
    }

}

export default function CategoryForm({ category }: CategoryFormProps) {
    const [data, setData] = React.useState({ text: category?.text || '' })
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const action = category ? updateCategory.bind(null, category.id) : createCategory


        try {
            const res = await action(data)
            actionToast({ ...res })
            if (res.success) {
                router.push('/dashboard/categories')
            }

        } catch (error) {
            const res = await action(data)
            actionToast({ success: false, message: `Fail to ${category ? 'update' : 'create'} category` })
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className='shadow border rounded p-4'>
            <form className='space-y-4'
                onSubmit={handleSubmit}
            >
                <div className='space-y-1'>
                    <label htmlFor="text" className='text-sm font-medium'>Category Name</label>
                    <input type="text" name="text" id="text"
                        value={data.text} onChange={handleChange}
                        placeholder='Enter category name' className='w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-700' />
                </div>

                <div className='flex justify-end'>
                    <button type='submit' className='rounded bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-700/80' disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}   
