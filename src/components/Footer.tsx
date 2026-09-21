import { Link } from "@tanstack/react-router";
import { HeadsetIcon } from "./Icons";
import { Newsletter } from "./Newsletter";
import { company, institutionalLinks } from "@/data/site";

const PAYMENT_SPRITE = "/img/67436b40-sprite-payments.svg";
// Sprite 1139x34 com 20 bandeiras de 56px (passo 57px).
const FLAG_W = 56;
const FLAG_H = 34;
const STEP = 57;
const SPRITE_W = 1139;

// Somente as bandeiras vistas na referência.
const FLAGS: { name: string; i: number }[] = [
  { name: "Visa", i: 0 },
  { name: "Mastercard", i: 1 },
  { name: "American Express", i: 2 },
  { name: "Diners Club", i: 3 },
  { name: "Hipercard", i: 4 },
  { name: "Elo", i: 6 },
  { name: "JCB", i: 9 },
  { name: "Pix", i: 16 },
];

export function PaymentFlags() {
  return (
    <div className="flex flex-wrap gap-2">
      {FLAGS.map((f) => (
        <span
          key={f.name}
          role="img"
          aria-label={f.name}
          title={f.name}
          className="block rounded border border-border bg-white bg-no-repeat"
          style={{
            width: `${FLAG_W}px`,
            height: `${FLAG_H}px`,
            backgroundImage: `url(${PAYMENT_SPRITE})`,
            backgroundSize: `${SPRITE_W}px ${FLAG_H}px`,
            backgroundPosition: `-${f.i * STEP}px 0`,
          }}
        />
      ))}
    </div>
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
              <span key={l.to} className="flex items-center gap-3">
                <Link
                  to="/ajuda/$slug"
                  params={{ slug: l.to.replace("/ajuda/", "") }}
                  className="hover:text-brand"
                >
                  {l.label}
                </Link>
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
            <div className="flex flex-col items-start gap-3">
              <PaymentFlags />
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
