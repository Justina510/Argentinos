import * as d3 from "d3";

export async function loadTreemapData(año) {
  const data = await d3.csv("/BasesLimpias/eph_full.csv");

  const ageGroups = [
    { name: "18-29", min: 18, max: 29 },
    { name: "30-39", min: 30, max: 39 },
    { name: "40-49", min: 40, max: 49 },
    { name: "50-70", min: 50, max: 70 },
  ];

  const result = ageGroups.map(group => {
    const groupRows = data.filter(
      d =>
        +d.year === año &&
        +d.CH06 >= group.min &&
        +d.CH06 <= group.max
    );

    const counts = { Formal: 0, Informal: 0, Desocupado: 0 };

    groupRows.forEach(r => {
  const pp = parseFloat(r.PP07G4); // convertir a número
  if (r.ESTADO?.toLowerCase() === "desocupado") counts.Desocupado++;
  else if (pp === 10) counts.Formal++;
  else if (pp === 2.0) counts.Informal++;
});

    return {
      name: group.name,
      children: [
        { name: "Formal", size: counts.Formal },
        { name: "Informal", size: counts.Informal },
        { name: "Desocupado", size: counts.Desocupado },
      ],
    };
  });

  return result;
}
