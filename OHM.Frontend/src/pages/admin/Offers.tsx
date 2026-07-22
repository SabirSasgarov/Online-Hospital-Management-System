import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer,
} from '@/hooks/useOffers'
import { getOfferIcon, offerIconOptions } from '@/lib/offerIcons'
import { ApiError } from '@/lib/apiClient'
import type { OfferDto } from '@/types/api'

interface FormData {
  title: string
  description: string
  icon: string
  displayOrder: number
  isActive: boolean
}

const emptyForm: FormData = { title: '', description: '', icon: 'Sparkles', displayOrder: 0, isActive: true }

export default function AdminOffers() {
  const [editing, setEditing] = useState<OfferDto | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useOffers({ pageSize: 100 })
  const createOffer = useCreateOffer()
  const updateOffer = useUpdateOffer()
  const deleteOffer = useDeleteOffer()

  const items = [...(data?.items ?? [])].sort((a, b) => a.displayOrder - b.displayOrder)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: emptyForm,
  })
  const isActive = watch('isActive')
  const icon = watch('icon')

  const openNew = () => {
    setEditing(null)
    setFormError('')
    reset({ ...emptyForm, displayOrder: items.length })
    setShowForm(true)
  }

  const openEdit = (o: OfferDto) => {
    setEditing(o)
    setFormError('')
    reset({ title: o.title, description: o.description, icon: o.icon, displayOrder: o.displayOrder, isActive: o.isActive })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    setFormError('')
    const dto = {
      title: data.title,
      description: data.description,
      icon: data.icon,
      displayOrder: Number(data.displayOrder) || 0,
      isActive: data.isActive,
    }
    try {
      if (editing) {
        await updateOffer.mutateAsync({ id: editing.id, dto })
      } else {
        await createOffer.mutateAsync(dto)
      }
      setShowForm(false)
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save offer.')
    }
  }

  const onDelete = (o: OfferDto) => {
    if (confirm(`Delete "${o.title}"? This cannot be undone.`)) {
      deleteOffer.mutate(o.id)
    }
  }

  return (
    <div>
      <PageHeader
        title="Offers"
        description="Manage the feature cards shown in the 'What CareFlow Offers' section on the public home page"
        action={<Button onClick={openNew}><Plus className="h-4 w-4" /> New Offer</Button>}
      />
      <div className="p-6 space-y-4">
        {isLoading && <p className="text-sm text-gray-400">Loading offers…</p>}
        {!isLoading && items.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No offers yet</p>
            <Button variant="outline" className="mt-3" onClick={openNew}>Create First Offer</Button>
          </div>
        )}
        {items.map((o) => {
          const Icon = getOfferIcon(o.icon)
          return (
            <Card key={o.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{o.title}</p>
                      <Badge variant={o.isActive ? 'success' : 'secondary'}>{o.isActive ? 'Active' : 'Hidden'}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{o.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Order {o.displayOrder}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(o)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => onDelete(o)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Offer' : 'New Offer'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input {...register('title', { required: 'Title is required' })} placeholder="e.g. Easy Appointment Booking" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea {...register('description', { required: 'Description is required' })} placeholder="Short blurb shown on the card" />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={(v) => setValue('icon', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {offerIconOptions.map((key) => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Display Order</Label>
              <Input type="number" {...register('displayOrder', { valueAsNumber: true })} placeholder="0" />
              <p className="text-xs text-gray-400">Lower numbers appear first.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={isActive}
                onChange={(e) => setValue('isActive', e.target.checked)}
              />
              Visible on the public home page
            </label>

            {formError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{formError}</div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Offer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
