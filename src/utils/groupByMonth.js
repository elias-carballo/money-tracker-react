export function groupByMonth(lista) {
  const grupos = {};

  lista.forEach((mov) => {
    const fecha = mov.fecha ? new Date(mov.fecha) : new Date();

    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, "0");

    const key = `${year}-${month}`;

    if (!grupos[key]) {
      grupos[key] = [];
    }

    grupos[key].push(mov);
  });

  return grupos;
}