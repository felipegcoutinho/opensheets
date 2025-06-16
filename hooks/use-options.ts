export interface LogoOption {
  file: string;
  name: string;
}

export default function UseOptions(): {
  logos: LogoOption[];
  bandeiras: LogoOption[];
} {
  const logos: LogoOption[] = [
    { file: "99Pay.png", name: "99Pay" },
    { file: "alelo.png", name: "Alelo" },
    { file: "azul.png", name: "Azul" },
    { file: "b3.png", name: "B3" },
    { file: "banrisul.png", name: "Banrisul" },
    { file: "bb.png", name: "Banco do Brasil" },
    { file: "bmg.png", name: "BMG" },
    { file: "bradesco.png", name: "Bradesco" },
    { file: "brb.png", name: "BRB" },
    { file: "bs2.png", name: "BS2" },
    { file: "c6bank.png", name: "C6" },
    { file: "caixa.png", name: "Caixa" },
    { file: "citibank.png", name: "Citibank" },
    { file: "cooperativa-cresol.png", name: "Cooperativa Cresol" },
    { file: "credicard-on.png", name: "Credicard On" },
    { file: "credicard-zero.png", name: "Credicard Zero" },
    { file: "credicard.png", name: "Credicard" },
    { file: "digio.png", name: "Digio" },
    { file: "diners.png", name: "Diners" },
    { file: "elo.png", name: "Elo" },
    { file: "infinitepay.png", name: "InfinitePay" },
    { file: "intermedium.png", name: "Inter" },
    { file: "interpj.png", name: "Inter PJ" },
    { file: "itau-ion.png", name: "Itaú Ion" },
    { file: "itau-uniclass.png", name: "Itaú Uniclass" },
    { file: "itau.png", name: "Itaú" },
    { file: "itaupersonnalite.png", name: "Itaú Personnalité" },
    { file: "iti.png", name: "Iti" },
    { file: "magalu-pay.png", name: "Magalu Pay" },
    { file: "mastercard.png", name: "Mastercard" },
    { file: "mercadobitcoin.png", name: "Mercado Bitcoin" },
    { file: "mercadopago.png", name: "Mercado Pago" },
    { file: "mercadopagocartao.png", name: "Cartão Mercado Pago" },
    { file: "neon.png", name: "Neon" },
    { file: "next.png", name: "Next" },
    { file: "nu-invest.png", name: "Nu Invest" },
    { file: "nubank.png", name: "Nubank" },
    { file: "nuconta.png", name: "NuConta" },
    { file: "original.png", name: "Original" },
    { file: "pagbank.png", name: "PagBank" },
    { file: "pagseguro.png", name: "PagSeguro" },
    { file: "paypal.png", name: "PayPal" },
    { file: "petrobras.png", name: "Petrobras" },
    { file: "picpay.png", name: "PicPay" },
    { file: "recargapay.png", name: "RecargaPay" },
    { file: "renner.png", name: "Renner" },
    { file: "safra.png", name: "Safra" },
    { file: "samsung.png", name: "Samsung" },
    { file: "santander-private.png", name: "Santander Private" },
    { file: "santander.png", name: "Santander" },
    { file: "sofisadireto.png", name: "Sofisa Direto" },
    { file: "stone.png", name: "Stone" },
    { file: "uber.drive.png", name: "Uber Drive" },
    { file: "visa.png", name: "Visa" },
    { file: "vuon.png", name: "Vuon" },
    { file: "vr.png", name: "VR" },
    { file: "xp.png", name: "XP" },
  ];

  const bandeiras: LogoOption[] = [
    { file: "visa.svg", name: "Visa" },
    { file: "mastercard.svg", name: "Mastercard" },
    { file: "vuon.svg", name: "Vuoncard" },
  ];

  return {
    logos,
    bandeiras,
  };
}
