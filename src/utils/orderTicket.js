export function downloadPickupTicket(order, branches = []) {
  if (!order) return;

  const branch = branches.find((item) => item.id == order.branchId || item.name === order.sucursal);
  const pickupBranch = order.sucursal || branch?.name || "Sucursal seleccionada";
  const customerName = order.clienteNombre || order.userName || "Cliente";
  const customerEmail = order.clienteCorreo || order.user || "No disponible";
  const customerPhone = order.clienteTelefono || "No registrado";
  const status = order.estado || order.status || "pendiente";
  const items = order.productos || order.items || [];

  const canvas = document.createElement("canvas");
  canvas.width = 560;
  canvas.height = Math.max(760, 500 + items.length * 30);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  ctx.fillStyle = "#064e3b";
  ctx.fillRect(8, 8, canvas.width - 16, 86);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FARMACIA FARMAGEN", canvas.width / 2, 45);
  ctx.font = "14px sans-serif";
  ctx.fillText("TICKET DE RECOGIDA EN SUCURSAL", canvas.width / 2, 70);

  ctx.textAlign = "left";
  ctx.fillStyle = "#111827";
  ctx.font = "bold 13px sans-serif";

  const leftLabel = 30;
  const leftValue = 150;
  let y = 126;
  const line = (label, value) => {
    ctx.font = "bold 13px sans-serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(label, leftLabel, y);
    ctx.font = "13px sans-serif";
    ctx.fillText(String(value || "No disponible"), leftValue, y);
    y += 24;
  };

  line("ID de Pedido:", order.id);
  line("Fecha:", order.date);
  line("Estado:", status);
  line("Cliente:", customerName);
  line("Correo:", customerEmail);
  line("Telefono:", customerPhone);
  line("Sucursal:", pickupBranch);

  if (branch?.address) {
    ctx.fillStyle = "#4b5563";
    ctx.font = "italic 11px sans-serif";
    ctx.fillText(branch.address, leftLabel, y + 2);
    y += 18;
  }

  if (branch?.hours) {
    ctx.fillStyle = "#4b5563";
    ctx.font = "italic 11px sans-serif";
    ctx.fillText(`Horario: ${branch.hours}`, leftLabel, y + 2);
    y += 20;
  }

  y += 10;
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftLabel, y);
  ctx.lineTo(canvas.width - leftLabel, y);
  ctx.stroke();

  y += 28;
  ctx.fillStyle = "#064e3b";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("PRODUCTO", 35, y);
  ctx.textAlign = "center";
  ctx.fillText("CANT.", canvas.width - 155, y);
  ctx.textAlign = "right";
  ctx.fillText("SUBTOTAL", canvas.width - 35, y);

  y += 30;
  ctx.textAlign = "left";
  ctx.fillStyle = "#111827";
  ctx.font = "13px sans-serif";

  items.forEach((item) => {
    const name = item.nombre || item.name || "Producto";
    const quantity = Number(item.cantidad || item.quantity || 1);
    const price = Number(item.precio || item.price || 0);
    const displayName = name.length > 34 ? `${name.slice(0, 31)}...` : name;

    ctx.textAlign = "left";
    ctx.fillText(displayName, 35, y);
    ctx.textAlign = "center";
    ctx.fillText(String(quantity), canvas.width - 155, y);
    ctx.textAlign = "right";
    ctx.fillText(`$${(price * quantity).toFixed(2)}`, canvas.width - 35, y);
    y += 26;
  });

  ctx.strokeStyle = "#e5e7eb";
  ctx.beginPath();
  ctx.moveTo(leftLabel, y + 10);
  ctx.lineTo(canvas.width - leftLabel, y + 10);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#111827";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("TOTAL DEL PEDIDO", 35, y + 44);
  ctx.textAlign = "right";
  ctx.fillStyle = "#10b981";
  ctx.fillText(`$${Number(order.total || 0).toFixed(2)}`, canvas.width - 35, y + 44);

  ctx.textAlign = "center";
  ctx.fillStyle = "#4b5563";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("PRESENTA ESTA IMAGEN EN LA SUCURSAL PARA RETIRAR TU PEDIDO", canvas.width / 2, canvas.height - 45);
  ctx.font = "10px sans-serif";
  ctx.fillText("Gracias por confiar en Farmacia FarmaGen.", canvas.width / 2, canvas.height - 25);

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = `ticket-pedido-${order.id}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
