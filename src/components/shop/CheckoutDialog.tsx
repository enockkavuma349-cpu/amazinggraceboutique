import * as React from "react";
import { CreditCard, Loader2, Smartphone, Truck, X, CheckCircle2 } from "lucide-react";
import { formatUGX } from "@/lib/catalog";

export type PayMethod = "card" | "mtn" | "airtel" | "cod";

const METHODS: { id: PayMethod; label: string; hint: string; icon: React.ReactNode }[] = [
  { id: "card", label: "Credit / Debit card", hint: "Mastercard · Visa", icon: <CreditCard className="size-4" /> },
  { id: "mtn", label: "MTN MoMo", hint: "MTN Mobile Money", icon: <Smartphone className="size-4" /> },
  { id: "airtel", label: "Airtel Money", hint: "Airtel e-wallet", icon: <Smartphone className="size-4" /> },
  { id: "cod", label: "Pay on delivery", hint: "Kampala only", icon: <Truck className="size-4" /> },
];

function digits(v: string) {
  return v.replace(/\D/g, "");
}

export type CheckoutDetails = {
  method: PayMethod;
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

export function CheckoutDialog({
  open,
  total,
  onClose,
  onPaid,
}: {
  open: boolean;
  total: number;
  onClose: () => void;
  onPaid: (details: CheckoutDetails) => Promise<void> | void;
}) {
  const [method, setMethod] = React.useState<PayMethod>("card");
  const [status, setStatus] = React.useState<"idle" | "processing" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);

  // delivery details
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [note, setNote] = React.useState("");

  // card
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  // mobile money
  const [phone, setPhone] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setStatus("idle");
      setError(null);
    }
  }, [open]);


  if (!open) return null;

  const brand = digits(cardNumber).startsWith("5") ? "Mastercard" : digits(cardNumber).startsWith("4") ? "Visa" : "Card";

  function validate(): string | null {
    if (name.trim().length < 2) return "Enter your full name.";
    if (digits(phoneNumber).length < 9) return "Enter a valid contact phone number.";
    if (address.trim().length < 4) return "Enter your delivery address.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    if (method === "card") {
      if (!cardName.trim()) return "Enter the name on the card.";
      if (digits(cardNumber).length < 16) return "Enter a valid 16-digit card number.";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Enter expiry as MM/YY.";
      if (digits(cvv).length < 3) return "Enter the 3-digit CVV.";
      return null;
    }
    if (method === "mtn" || method === "airtel") {
      const p = digits(phone);
      if (p.length < 9) return "Enter a valid phone number.";
      if (method === "mtn" && !/^(0?7[7867])/.test(p)) return "That does not look like an MTN number (077/078/076).";
      if (method === "airtel" && !/^(0?7[05])/.test(p)) return "That does not look like an Airtel number (070/075).";
      return null;
    }
    return null;
  }

  async function pay() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStatus("processing");
    await new Promise((r) => setTimeout(r, method === "cod" ? 700 : 1500));
    try {
      await onPaid({ method, name: name.trim(), phone: phoneNumber.trim(), email: email.trim(), address: address.trim(), note: note.trim() });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Could not place the order. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Payment"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">Complete payment</h2>
            <p className="text-sm text-muted-foreground">Amount due {formatUGX(total)}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {status === "done" ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto size-12 text-accent" />
            <p className="mt-3 font-semibold text-foreground">Payment successful</p>
            <p className="text-sm text-muted-foreground">Finalising your order…</p>
          </div>
        ) : (
          <>
            <div className="mt-5 space-y-3 rounded-lg border border-border bg-background/60 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Delivery details</p>
              <Field label="Full name" value={name} onChange={setName} placeholder="Grace Nakato" />
              <Field label="Phone number" value={phoneNumber} onChange={setPhoneNumber} placeholder="0771 234 567" inputMode="tel" />
              <Field label="Email (optional)" value={email} onChange={setEmail} placeholder="you@example.com" />
              <Field label="Delivery address" value={address} onChange={setAddress} placeholder="Kampala Road, Nakasero" />
              <Field label="Note (optional)" value={note} onChange={setNote} placeholder="Landmark, preferred time…" />
            </div>

            <div className="mt-5 grid gap-2">

              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMethod(m.id);
                    setError(null);
                  }}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left ${
                    method === m.id ? "border-accent bg-accent/10" : "border-border bg-background"
                  }`}
                >
                  <span className="text-foreground">{m.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-foreground">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.hint}</span>
                  </span>
                  <span
                    className={`size-4 rounded-full border ${method === m.id ? "border-accent bg-accent" : "border-border"}`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {method === "card" && (
                <>
                  <Field label="Name on card" value={cardName} onChange={setCardName} placeholder="Grace Nakato" />
                  <Field
                    label={`Card number${brand !== "Card" ? ` · ${brand}` : ""}`}
                    value={cardNumber}
                    onChange={(v) =>
                      setCardNumber(
                        digits(v)
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      )
                    }
                    placeholder="5399 4400 0000 0000"
                    inputMode="numeric"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Expiry"
                      value={expiry}
                      onChange={(v) => {
                        const d = digits(v).slice(0, 4);
                        setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                      }}
                      placeholder="MM/YY"
                      inputMode="numeric"
                    />
                    <Field
                      label="CVV"
                      value={cvv}
                      onChange={(v) => setCvv(digits(v).slice(0, 4))}
                      placeholder="123"
                      inputMode="numeric"
                    />
                  </div>
                </>
              )}

              {(method === "mtn" || method === "airtel") && (
                <>
                  <Field
                    label={method === "mtn" ? "MTN MoMo number" : "Airtel Money number"}
                    value={phone}
                    onChange={(v) => setPhone(digits(v).slice(0, 12))}
                    placeholder={method === "mtn" ? "0771 234 567" : "0701 234 567"}
                    inputMode="tel"
                  />
                  <p className="text-xs text-muted-foreground">
                    You will receive a prompt on your phone. Enter your PIN to approve {formatUGX(total)}.
                  </p>
                </>
              )}

              {method === "cod" && (
                <p className="text-sm text-muted-foreground">
                  Pay our rider {formatUGX(total)} in cash when your order arrives. Available within Kampala.
                </p>
              )}
            </div>

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

            <button
              onClick={pay}
              disabled={status === "processing"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
            >
              {status === "processing" && <Loader2 className="size-4 animate-spin" />}
              {status === "processing"
                ? method === "cod"
                  ? "Placing order…"
                  : "Waiting for approval…"
                : method === "cod"
                  ? "Confirm order"
                  : `Pay ${formatUGX(total)}`}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Demo checkout — no real money is transferred yet.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "tel";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
