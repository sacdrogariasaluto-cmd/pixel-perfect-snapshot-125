import { HeadsetIcon } from "./Icons";
import { Newsletter } from "./Newsletter";
import { company, institutionalLinks } from "@/data/site";

const PAYMENT_SPRITE = "/img/67436b40-sprite-payments.svg";
const SPRITE_COUNT = 24;
const SPRITE_W = 1139;
const SLICE = SPRITE_W / SPRITE_COUNT;
// Índices das bandeiras dentro do sprite de referência.
const FLAGS: { index: number; name: string }[] = [
  { index: 0, name: "Visa" },
  { index: 1, name: "Mastercard" },
  { index: 2, name: "American Express" },
  { index: 3, name: "Diners Club" },
  { index: 4, name: "Hipercard" },
  { index: 5, name: "Hiper" },
  { index: 6, name: "Elo" },
  { index: 7, name: "Discover" },
  { index: 11, name: "JCB" },
  { index: 12, name: "Maestro" },
  { index: 13, name: "Visa Electron" },
  { index: 14, name: "Ame" },
  { index: 15, name: "PicPay" },
  { index: 17, name: "Sodexo Alimentação" },
  { index: 19, name: "Pix" },
  { index: 20, name: "VR" },
  { index: 21, name: "Ticket" },
  { index: 22, name: "Sorocred" },
];

function PaymentFlag({ index, name }: { index: number; name: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className="block h-[34px] w-[48px] rounded border border-border bg-white bg-no-repeat"
      style={{
        backgroundImage: `url(${PAYMENT_SPRITE})`,
        backgroundSize: `${SPRITE_W}px 34px`,
        backgroundPosition: `-${index * SLICE}px 0`,
      }}
    />
  );
}


const socials = [
  { name: "Facebook", color: "#1877f2", letter: "f" },
  { name: "Instagram", color: "#d62976", letter: "in" },
  { name: "LinkedIn", color: "#0a66c2", letter: "in" },
  { name: "WhatsApp", color: "#25d366", letter: "w" },
];

export function Footer() {
  return (
    <footer className="bg-surface text-sm">
      <Newsletter />

      <div className="border-t border-border">
        <div className="container-site flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2">
            <HeadsetIcon className="h-7 w-7" />
            <span className="leading-tight">
              Central de
              <br />
              <strong>Atendimento</strong>
            </span>
          </span>
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Institucional">
            {institutionalLinks.map((l, i) => (
              <span key={l} className="flex items-center gap-3">
                <a href="#" className="hover:text-brand">
                  {l}
                </a>
                {i < institutionalLinks.length - 1 && (
                  <span className="text-border" aria-hidden="true">
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site grid gap-8 py-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-muted-foreground">Pague com</h3>
            <div className="flex flex-wrap gap-2">
              {FLAGS.map((f, i) => (
                <PaymentFlag key={f} index={i} name={f} />
              ))}
              <img
                src="/img/10fbedc9-cartao-convenio.png"
                alt="Cartão convênio"
                className="h-[34px] w-auto rounded border border-border"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-muted-foreground">Segurança</h3>
            <div className="flex items-center gap-4">
              <img src="/img/8329908e-safe_google.png" alt="Navegação Segura Google" className="h-9 w-auto" />
              <img src="/img/938969c2-safe_norton.png" alt="Norton Safe Web" className="h-9 w-auto" />
              <img
                src="/img/62ac177e-otimo.svg"
                alt="Selo de reputação Reclame Aqui"
                className="h-20 w-auto rounded border border-border p-1"
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Selos de referência. Exiba apenas certificações aplicáveis ao projeto publicado.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-muted-foreground">Redes Sociais</h3>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: s.color }}
                >
                  {s.letter}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-muted-foreground">Baixe nosso aplicativo</h3>
            <div className="flex gap-3">
              <img src="/img/11dcac59-google-play.svg" alt="Google Play" className="h-10 w-auto" />
              <img src="/img/0d04a073-apple-store.svg" alt="App Store" className="h-10 w-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site py-8 text-[12px] leading-relaxed text-muted-foreground">
          <p className="mb-4 flex items-center gap-3 text-foreground">
            A loja segue as determinações da
            <img src="/img/1c567617-anvisa.png" alt="Anvisa" className="h-8 w-auto" />
          </p>
          <p>
            {company.name} | {company.fantasy} | {company.cnpj} | I.E. {company.ie} |{" "}
            {company.address} | Horário de Atendimento: {company.hours} | SAC: {company.sac} |{" "}
            Farmacêutico responsável: {company.tech}.
          </p>
          <p className="mt-3">
            As informações deste site não devem ser usadas para automedicação e não substituem as
            orientações do profissional da área médica. Somente o médico está apto a diagnosticar e
            prescrever o tratamento adequado. Preços e promoções são válidos apenas para compras
            feitas pela internet e dependem de confirmação de disponibilidade em estoque.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 opacity-80">
            <img src="/img/0ccf97d4-convertize.svg" alt="Convertize" className="h-6 w-auto" />
            <img src="/img/6f1e1ecd-etrio_preto.svg" alt="Etrio" className="h-6 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
