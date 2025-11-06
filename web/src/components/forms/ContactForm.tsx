import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import emailjs from "@emailjs/browser";
import { useEffect, useRef } from "react";

/* Konu seçenekleri (sabit) */
const SUBJECT_OPTIONS = [
  { value: "partnership", label: "Partnership" },
  { value: "purchase", label: "Purchase / Payments" },
  { value: "tour_info", label: "Tour Information" },
  { value: "booking_changes", label: "Booking Changes" },
  { value: "technical", label: "Technical Issue" },
  { value: "group", label: "Corporate / Group Bookings" },
  { value: "other", label: "Other" },
] as const;

type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

interface FormData {
  user_name: string;
  user_email: string;
  subject: SubjectValue;
  message: string;
}

/* EmailJS yapılandırması (Vite env) */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "themedox";
const TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_vvhaqp9";
const PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "8J7ZO8OH7mUoEA9WX";
const TO_EMAIL = import.meta.env.VITE_CONTACT_TO_EMAIL || "support@lexor.com";

/* Doğrulama şeması */
const schema = yup
  .object({
    user_name: yup.string().required().label("Name"),
    user_email: yup.string().email().required().label("E-mail"),
    subject: yup
      .mixed<SubjectValue>()
      .oneOf(SUBJECT_OPTIONS.map((o) => o.value) as SubjectValue[])
      .required()
      .label("Subject"),
    message: yup.string().required().label("Message"),
  })
  .required();

/* Güvenli hata mesajı çıkarıcı (any kullanmadan) */
function getErrorText(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "text" in err) {
    const t = (err as { text?: string }).text;
    if (t) return t;
  }
  return "Failed to send message. Please try again.";
}

interface ContactFormProps {
  whatsappUrl?: string;
}

const ContactForm = ({ whatsappUrl }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      emailjs.init(PUBLIC_KEY);
    } catch {
      /* no-op */
    }
  }, []);

  const sendEmail = async () => {
    // EmailJS ayarları yoksa erken çık
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !TO_EMAIL) {
      toast.error("Email configuration is missing. Please set env variables.", {
        position: "top-center",
      });
      return;
    }
    if (!form.current) {
      toast.error("Form reference is null.", { position: "top-center" });
      return;
    }

    try {
      const res = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        form.current,
        PUBLIC_KEY
      );
      console.log("[EmailJS] status:", res.status, "text:", res.text);
      toast.success("Message sent successfully", { position: "top-center" });
      reset();
    } catch (err: unknown) {
      console.error("[EmailJS] error:", err);
      toast.error(getErrorText(err), { position: "top-center" });
    }
  };

  // reply_to: çoğu şablon bunu "Reply-To" olarak kullanır
  const replyTo = watch("user_email", "");

  return (
    <>
      <style>{`
        .contact-select{
          width: 100%;
          height: 52px;
          border-radius: 10px;
          padding: 0 16px;
          border: 1px solid var(--tg-border-1, #EDEDED);
          background: #fff;
          outline: none;
        }
        .contact-select:focus{
          border-color: var(--tg-theme-1, #7f0af5);
        }
        /* Mesaj placeholder'ını aşağı çekmek için üst pad arttırıldı */
        .textarea{
          display: block;
          width: 100%;
          min-height: 170px;
          padding: 28px 16px 14px; /* üst padding artırıldı */
          line-height: 1.45;       /* paragraf aralıklarını sıkılaştır */
          border-radius: 10px;
          border: 1px solid var(--tg-border-1, #EDEDED);
          outline: none;
          resize: vertical;
        }
        .textarea:focus{
          border-color: var(--tg-theme-1, #7f0af5);
        }
        .textarea::placeholder{
          opacity: 0.85;
        }
        .tg-btn-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #25D366;
          color: #fff;
          padding: 12px 27px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          font-size: 15px;
        }
        .tg-btn-whatsapp:hover {
          background: #20BA5A;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
          color: #fff;
        }
        .tg-btn-whatsapp i {
          font-size: 20px;
        }
        .w-100 {
          width: 100%;
        }
      `}</style>

      {/* Şablonda şu alanların tanımlı olduğundan emin olun:
          user_name, user_email, subject, message, to_email, reply_to */}
      <form ref={form} onSubmit={handleSubmit(sendEmail)} id="contact-form">
        <input type="hidden" name="to_email" value={TO_EMAIL} />
        <input type="hidden" name="reply_to" value={replyTo} />

        <div className="row">
          <div className="col-lg-6 mb-25">
            <input
              className="input"
              type="text"
              {...register("user_name")}
              placeholder="Name"
              aria-label="Name"
            />
            <p className="form_error">{errors.user_name?.message}</p>
          </div>

          <div className="col-lg-6 mb-25">
            <input
              className="input"
              type="email"
              {...register("user_email")}
              placeholder="E-mail"
              aria-label="E-mail"
            />
            <p className="form_error">{errors.user_email?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <select
              className="contact-select"
              {...register("subject")}
              defaultValue=""
              aria-label="Subject"
            >
              <option value="" disabled>
                Select subject
              </option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="form_error">{errors.subject?.toString()}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <textarea
              className="textarea mb-5"
              {...register("message")}
              placeholder="Message"
              aria-label="Message"
              /* force the placeholder to sit lower */
              style={{ paddingTop: 15, lineHeight: 1.45, minHeight: 170 }}
            />
            <p className="form_error">{errors.message?.message}</p>
          </div>

          <div className="col-lg-6 mb-25">
            <button type="submit" className="tg-btn w-100" name="message">
              SEND MESSAGE
            </button>
            <p className="ajax-response mb-0 pt-10"></p>
          </div>

          {whatsappUrl && (
            <div className="col-lg-6 mb-25">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tg-btn tg-btn-whatsapp w-100"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Contact us on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default ContactForm;
