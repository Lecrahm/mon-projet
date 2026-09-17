export function renderLutherCard(
  canvas: HTMLCanvasElement,
  input: { title: string; rant: string },
) {
  const w = 1080;
  const h = 1350;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0c0b0a";
  ctx.fillRect(0, 0, w, h);

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "rgba(196, 92, 58, 0.18)");
  gradient.addColorStop(0.45, "rgba(12, 11, 10, 0)");
  gradient.addColorStop(1, "rgba(196, 165, 116, 0.12)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(196, 165, 116, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, w - 128, h - 128);

  ctx.fillStyle = "#c45c3a";
  ctx.font = "500 22px Geist, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("LUTHER · FACE & OMBRE", 110, 150);

  ctx.fillStyle = "#f4efe6";
  ctx.font = "italic 64px 'Instrument Serif', Georgia, serif";
  wrapText(ctx, input.title, 110, 250, w - 220, 74);

  ctx.fillStyle = "rgba(244, 239, 230, 0.88)";
  ctx.font = "32px 'Instrument Serif', Georgia, serif";
  wrapText(ctx, input.rant, 110, 430, w - 220, 46);

  ctx.fillStyle = "#c4a574";
  ctx.font = "500 22px Geist, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Dis la vérité en Ombre. Envoie la Face qui passe.", 110, h - 140);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/);
  let line = "";
  let cursor = y;
  const maxY = 1180;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
      if (cursor > maxY) {
        ctx.fillText("…", x, cursor);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
}
