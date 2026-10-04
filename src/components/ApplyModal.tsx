import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp } from '@/store/AppContext'
import { useI18n } from '@/i18n'
import type { HelpRequest } from '@/types'

export function ApplyModal({
  request, open, onClose,
}: { request: HelpRequest; open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const { applyToRequest, pushToast } = useApp()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')

  const submit = () => {
    if (!message.trim()) return
    const { conversation } = applyToRequest(request.id, message.trim(), price ? Number(price) : undefined)
    pushToast({
      title: t('request.offerSent'),
      description: t('request.offerSentDesc'),
      variant: 'success',
    })
    onClose()
    navigate(`/messages/${conversation.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('request.howCanYouHelp')}</DialogTitle>
          <DialogDescription className="line-clamp-1">{request.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('request.offerPlaceholder')}
            rows={4}
            autoFocus
          />
          <div>
            <Label htmlFor="offer-price" className="text-xs text-muted-foreground">
              {t('request.yourPrice')}
            </Label>
            <Input
              id="offer-price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={request.currency}
              className="mt-1"
            />
          </div>
          <Button className="w-full" onClick={submit} disabled={!message.trim()}>
            {t('action.apply')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
