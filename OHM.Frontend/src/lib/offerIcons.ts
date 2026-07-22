import {
  CalendarCheck, Stethoscope, FlaskConical, MessageSquare, Users, ShieldCheck,
  Pill, HeartPulse, Clock, Award, Activity, Ambulance, ClipboardList, Sparkles,
  type LucideIcon,
} from 'lucide-react'

/** Icon choices offered in the admin Offers CMS; keys are stored on the Offer entity. */
export const offerIconMap: Record<string, LucideIcon> = {
  CalendarCheck, Stethoscope, FlaskConical, MessageSquare, Users, ShieldCheck,
  Pill, HeartPulse, Clock, Award, Activity, Ambulance, ClipboardList, Sparkles,
}

export const offerIconOptions = Object.keys(offerIconMap)

export function getOfferIcon(key: string): LucideIcon {
  return offerIconMap[key] ?? Sparkles
}
