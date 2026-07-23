import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Megaphone, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement,
} from '@/hooks/useAnnouncements'
import { ApiError } from '@/lib/apiClient'
import type { AnnouncementDto } from '@/types/api'

interface FormData {
  title: string
  summary: string
  content: string
  imageUrl: string
  isPublished: boolean
}

const emptyForm: FormData = { title: '', summary: '', content: '', imageUrl: '', isPublished: false }

export default function AdminAnnouncements() {
  const [editing, setEditing] = useState<AnnouncementDto | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useAnnouncements({ pageSize: 100 })
  const createAnnouncement = useCreateAnnouncement()
  const updateAnnouncement = useUpdateAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()

  const items = data?.items ?? []

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: emptyForm,
  })
  const isPublished = watch('isPublished')
  const imageUrl = watch('imageUrl')

  const openNew = () => {
    setEditing(null)
    setFormError('')
    reset(emptyForm)
    setShowForm(true)
  }

  const openEdit = (a: AnnouncementDto) => {
    setEditing(a)
    setFormError('')
    reset({ title: a.title, summary: a.summary, content: a.content, imageUrl: a.imageUrl ?? '', isPublished: a.isPublished })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    setFormError('')
    const dto = {
      title: data.title,
      summary: data.summary,
      content: data.content,
      imageUrl: data.imageUrl || undefined,
      isPublished: data.isPublished,
    }
    try {
      if (editing) {
        await updateAnnouncement.mutateAsync({ id: editing.id, dto })
      } else {
        await createAnnouncement.mutateAsync(dto)
      }
      setShowForm(false)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save announcement.')
    }
  }

  const onDelete = (a: AnnouncementDto) => {
    if (confirm(`Delete "${a.title}"? This cannot be undone.`)) {
      deleteAnnouncement.mutate(a.id)
    }
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Manage the news feed shown on the public home page"
        action={<Button onClick={openNew}><Plus className="h-4 w-4" /> New Announcement</Button>}
      />
      <div className="p-6 space-y-4">
        {isLoading && <p className="text-sm text-gray-400">Loading announcements…</p>}
        {!isLoading && items.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <Megaphone className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No announcements yet</p>
            <Button variant="outline" className="mt-3" onClick={openNew}>Create First Announcement</Button>
          </div>
        )}
        {items.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{a.title}</p>
                    <Badge variant={a.isPublished ? 'success' : 'secondary'}>{a.isPublished ? 'Published' : 'Draft'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.summary}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {a.author && `By ${a.author} · `}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(a)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => onDelete(a)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Announcement' : 'New Announcement'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input {...register('title', { required: 'Title is required' })} placeholder="e.g. New Cardiology Wing Now Open" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Summary</Label>
              <Textarea {...register('summary', { required: 'Summary is required' })} placeholder="Short blurb shown on the announcement card" />
              {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea rows={6} {...register('content', { required: 'Content is required' })} placeholder="Full announcement text" />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            </div>
            <ImageUpload
              label="Announcement Image (optional)"
              shape="wide"
              value={imageUrl}
              onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={isPublished}
                onChange={(e) => setValue('isPublished', e.target.checked)}
              />
              Publish immediately (visible on the public home page)
            </label>

            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{formError}</div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Announcement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
