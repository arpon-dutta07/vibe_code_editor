"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CreditCard,
  QrCode,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CheckoutDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => Promise<{ success: boolean; error?: string; alreadyOwned?: boolean }>
  itemName: string
  itemPrice: number
  itemType: "style" | "skill"
}

type PaymentStage = "idle" | "processing" | "success" | "error"

export function CheckoutDialog({
  isOpen,
  onClose,
  onSuccess,
  itemName,
  itemPrice,
  itemType,
}: CheckoutDialogProps) {
  const [activeTab, setActiveTab] = React.useState<"card" | "upi">("card")
  const [stage, setStage] = React.useState<PaymentStage>("idle")
  const [processStep, setProcessStep] = React.useState(0)
  const [errorMessage, setErrorMessage] = React.useState("")

  // Card Form State
  const [cardName, setCardName] = React.useState("")
  const [cardNumber, setCardNumber] = React.useState("")
  const [cardExpiry, setCardExpiry] = React.useState("")
  const [cardCvv, setCardCvv] = React.useState("")

  // UPI Form State
  const [upiId, setUpiId] = React.useState("")

  // Reset form states
  React.useEffect(() => {
    if (!isOpen) {
      setStage("idle")
      setProcessStep(0)
      setErrorMessage("")
      setCardName("")
      setCardNumber("")
      setCardExpiry("")
      setCardCvv("")
      setUpiId("")
    }
  }, [isOpen])

  // Formatting utilities
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ")
    setCardNumber(formattedValue.slice(0, 19))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    let formattedValue = value
    if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }
    setCardExpiry(formattedValue.slice(0, 5))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setCardCvv(value.slice(0, 3))
  }

  // Validations
  const isCardValid = () => {
    const cleanNum = cardNumber.replace(/\s/g, "")
    const cleanExp = cardExpiry.replace(/\//g, "")
    return (
      cardName.trim().length >= 3 &&
      cleanNum.length === 16 &&
      cleanExp.length === 4 &&
      cardCvv.length === 3
    )
  }

  const isUpiValid = () => {
    return upiId.includes("@") && upiId.trim().length >= 5
  }

  const canPay = activeTab === "card" ? isCardValid() : isUpiValid()

  // Sequential loading steps
  const steps = [
    "Securely connecting to merchant channel...",
    "Authorizing payment tokens...",
    "Syncing licenses and finalizing purchase...",
  ]

  const handlePayment = async () => {
    if (!canPay) return
    setStage("processing")
    setProcessStep(0)

    // Simulate payment stages sequentially
    try {
      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setProcessStep(i + 1)
      }

      // Hit actual server action database push
      const res = await onSuccess()
      if (res.success) {
        setStage("success")
        toast.success(res.alreadyOwned ? "Unlocked!" : `${itemName} successfully purchased!`)
      } else {
        setErrorMessage(res.error || "Database sync failed. Please check connection.")
        setStage("error")
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected transaction error occurred.")
      setStage("error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && stage !== "processing" && onClose()}>
      <DialogContent hideCloseButton className="max-w-[460px] p-0 border border-zinc-800 bg-[#0d0d0d] text-zinc-100 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        {/* Top Header bar with custom styling */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-900 bg-zinc-950/40 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-[#FF2D6B]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between z-10">
            <div>
              <DialogTitle className="text-base font-bold text-zinc-100 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#FF2D6B]" /> Secure Checkout
              </DialogTitle>
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide mt-0.5">
                VibeCode Payment Gateway v1.0
              </p>
            </div>
            {stage !== "processing" && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </DialogHeader>

        {stage === "idle" && (
          <div className="p-6 flex flex-col">
            {/* Invoice Section */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF2D6B]/2 to-transparent pointer-events-none" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#FF2D6B] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-[#FF2D6B]/10 border border-[#FF2D6B]/20">
                    {itemType === "style" ? "Design Style" : "AI Skill"}
                  </span>
                  <h4 className="font-extrabold text-sm text-zinc-200 mt-2.5 truncate max-w-[260px]">
                    {itemName}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 font-medium">Amount Due</div>
                  <div className="text-2xl font-black text-zinc-100 font-mono mt-0.5">
                    ₹{itemPrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <Tabs
              defaultValue="card"
              onValueChange={(v) => setActiveTab(v as "card" | "upi")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 bg-zinc-950 border border-zinc-800 p-1 rounded-xl mb-6">
                <TabsTrigger
                  value="card"
                  className="rounded-lg text-xs font-semibold py-2 cursor-pointer transition-all data-[state=active]:bg-[#FF2D6B] data-[state=active]:text-white"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Credit/Debit Card
                </TabsTrigger>
                <TabsTrigger
                  value="upi"
                  className="rounded-lg text-xs font-semibold py-2 cursor-pointer transition-all data-[state=active]:bg-[#FF2D6B] data-[state=active]:text-white"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1.5" /> UPI / QR Scan
                </TabsTrigger>
              </TabsList>

              {/* CARD PAYMENT FORM */}
              <TabsContent value="card" className="space-y-4 outline-none">
                <div className="space-y-1.5">
                  <Label htmlFor="cardName" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="h-10 bg-zinc-950 border-zinc-800 focus:border-[#FF2D6B] focus:ring-0 rounded-lg text-zinc-200 placeholder:text-zinc-700 text-xs transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4444"
                    className="h-10 bg-zinc-950 border-zinc-800 focus:border-[#FF2D6B] focus:ring-0 rounded-lg text-zinc-200 placeholder:text-zinc-700 text-xs font-mono transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardExpiry" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Expiry Date
                    </Label>
                    <Input
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="h-10 bg-zinc-950 border-zinc-800 focus:border-[#FF2D6B] focus:ring-0 rounded-lg text-zinc-200 placeholder:text-zinc-700 text-xs font-mono transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardCvv" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      CVV / CVC
                    </Label>
                    <Input
                      id="cardCvv"
                      type="password"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className="h-10 bg-zinc-950 border-zinc-800 focus:border-[#FF2D6B] focus:ring-0 rounded-lg text-zinc-200 placeholder:text-zinc-700 text-xs font-mono transition-colors"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* UPI PAYMENT FORM */}
              <TabsContent value="upi" className="space-y-5 outline-none">
                {/* Simulated QR Code Scan */}
                <div className="flex flex-col items-center p-4 border border-dashed border-zinc-800 bg-zinc-950/40 rounded-xl">
                  <div className="relative p-3 bg-white rounded-xl mb-3 shadow-[0_0_20px_rgba(255,255,255,0.06)] animate-pulse">
                    {/* Glowing Accent Outline */}
                    <div className="absolute inset-0 border-2 border-[#FF2D6B]/50 rounded-xl blur-[3px]" />
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                      className="text-black fill-current"
                    >
                      {/* Standard Mock QR Code Pattern */}
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                      <path d="M40,0 h10 v10 h-10 z M50,10 h10 v10 h-10 z M40,20 h10 v20 h-10 z M60,30 h10 v10 h-10 z M30,50 h10 v20 h-10 z M50,50 h20 v10 h-20 z M80,40 h20 v10 h-20 z M80,60 h10 v30 h-10 z" />
                      <path d="M40,70 h20 v10 h-20 z M40,90 h10 v10 h-10 z M60,80 h10 v20 h-10 z M80,80 h10 v10 h-10 z M90,90 h10 v10 h-10 z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono text-center tracking-wider uppercase">
                    Scan with any UPI App (GPay, PhonePe, Paytm)
                  </p>
                </div>

                <div className="relative flex py-1.5 items-center">
                  <div className="flex-grow border-t border-zinc-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    OR Pay via UPI ID
                  </span>
                  <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="upiId" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Enter UPI ID
                  </Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="john@okaxis"
                    className="h-10 bg-zinc-950 border-zinc-800 focus:border-[#FF2D6B] focus:ring-0 rounded-lg text-zinc-200 placeholder:text-zinc-700 text-xs transition-colors"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Pay Button */}
            <Button
              disabled={!canPay}
              onClick={handlePayment}
              className={cn(
                "w-full h-11 rounded-lg mt-8 text-white font-bold text-xs font-mono uppercase tracking-widest transition-all duration-300",
                canPay
                  ? "bg-[#FF2D6B] hover:bg-[#e0175a] shadow-[0_4px_25px_rgba(255,45,107,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              )}
            >
              <Lock className="w-3.5 h-3.5 mr-2" /> Pay ₹{itemPrice}
            </Button>

            <div className="flex items-center justify-center gap-1 text-[9px] text-zinc-600 font-mono tracking-wider uppercase mt-4">
              <ShieldCheck className="w-3 h-3 text-zinc-600" /> AES-256 Encrypted Security Protocol
            </div>
          </div>
        )}

        {/* PROCESSING SCREEN */}
        {stage === "processing" && (
          <div className="px-8 py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-8">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 border-4 border-t-[#FF2D6B] border-r-transparent border-b-[#FF2D6B]/20 border-l-transparent rounded-full animate-spin" />
              {/* Inner opposite spin ring */}
              <div className="absolute inset-2 border-4 border-r-[#FF2D6B] border-t-transparent border-l-[#FF2D6B]/20 border-b-transparent rounded-full animate-spin-reverse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#FF2D6B] animate-spin" />
              </div>
            </div>
            <h3 className="text-base font-bold text-zinc-200 tracking-wide mb-2 uppercase font-mono">
              Processing Transaction
            </h3>
            <div className="h-6 overflow-hidden relative w-full">
              <p className="text-xs text-zinc-500 font-medium tracking-wide animate-fade-in-out">
                {steps[Math.min(processStep, steps.length - 1)]}
              </p>
            </div>
            <p className="text-[10px] text-zinc-600 font-mono tracking-wider uppercase mt-8 animate-pulse">
              Please do not refresh this page or close the window.
            </p>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {stage === "success" && (
          <div className="px-8 py-14 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-black text-zinc-100 tracking-wide mb-2 uppercase font-mono">
              Payment Successful!
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mb-6">
              Thank you! You have successfully unlocked <strong>{itemName}</strong>. It is now fully active for all your projects.
            </p>
            <div className="w-full border-t border-zinc-900 pt-6 mt-2">
              <Button
                onClick={() => {
                  onClose()
                  window.location.reload()
                }}
                className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
              >
                Close & Return
              </Button>
            </div>
          </div>
        )}

        {/* ERROR SCREEN */}
        {stage === "error" && (
          <div className="px-8 py-14 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-[#FF2D6B]" />
            </div>
            <h3 className="text-base font-bold text-zinc-100 tracking-wide mb-2 uppercase font-mono">
              Transaction Declined
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mb-8">
              {errorMessage || "The card transaction could not be authorized. Please review your details."}
            </p>
            <div className="w-full flex gap-3 border-t border-zinc-900 pt-6">
              <Button
                onClick={() => setStage("idle")}
                className="flex-1 h-11 bg-[#FF2D6B] hover:bg-[#e0175a] text-white font-semibold rounded-lg text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
              >
                Retry
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 h-11 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-semibold rounded-lg text-xs font-mono uppercase tracking-widest border border-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
