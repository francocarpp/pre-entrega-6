
class Guardia {
    constructor(id, sector, valorHora, cuposDisponibles) {
        this.id = id;
        this.sector = sector;
        this.valorHora = valorHora;
        this.cuposDisponibles = cuposDisponibles;
    }

    asignarCupo(cantidad) {
        if (cantidad <= 0 || isNaN(cantidad)) {
            console.warn(`⚠️ Cantidad inválida para ${this.sector}.`);
            return false;
        }
        if (cantidad > this.cuposDisponibles) {
            console.warn(`❌ Sin cupos suficientes en ${this.sector}. Disponibles: ${this.cuposDisponibles}`);
            return false;
        }
        this.cuposDisponibles -= cantidad;
        console.log(`✅ Se asignó ${cantidad} cupo(s) en ${this.sector}. Cupos restantes: ${this.cuposDisponibles}`);
        return true;
    }

    calcularLiquidacion(horas) {
        let subtotal = this.valorHora * horas;
        if (horas > 24) {
            subtotal *= 1.1;
            console.log(`⭐ Plus del 10% aplicado en ${this.sector} por superar las 24 horas.`);
        }
        return subtotal;
    }
}

const guardiasDisponibles = [
    new Guardia(1, "Guardia Diurna", 6500, 5),
    new Guardia(2, "Guardia Nocturna / Feriado", 8500, 4),
    new Guardia(3, "Guardia de Refuerzo", 7500, 6),
    new Guardia(4, "Terapia Intensiva", 9200, 0)
];

function pedirHoras(nombreSector) {
    let horas = Number(prompt(`Ingresá la cantidad de horas para ${nombreSector}:`));
    while (isNaN(horas) || horas <= 0) {
        alert("Ingresá un número mayor a 0.");
        horas = Number(prompt(`Ingresá nuevamente las horas para ${nombreSector}:`));
    }
    return horas;
}

const mostrarResumenParcial = (sector, horas, monto) => {
    const mensaje = `Sector: ${sector} | Horas: ${horas} | Subtotal: $${monto}`;
    console.log("📋 " + mensaje);
    alert(mensaje);
};

console.log("🩺 Iniciando simulador con funciones de orden superior...");
alert("Bienvenido al simulador de guardias con búsqueda, filtros y cálculos.");

const idBuscado = Number(prompt("Ingresá el ID de guardia que querés consultar (1 a 4):"));
const guardiaEncontrada = guardiasDisponibles.find(g => g.id === idBuscado);

if (guardiaEncontrada) {
    console.log("🔎 Guardia encontrada con find():", guardiaEncontrada);
    alert(`Encontrada: ${guardiaEncontrada.sector} ($${guardiaEncontrada.valorHora}/h | Cupos: ${guardiaEncontrada.cuposDisponibles})`);
} else {
    console.log(`❌ No se encontró ninguna guardia con el ID ${idBuscado}.`);
    alert(`No se encontró ninguna guardia con el ID ${idBuscado}.`);
}

const guardiasConCupoYBuenValor = guardiasDisponibles.filter(g => g.cuposDisponibles > 0 && g.valorHora >= 7500);
console.log("📌 Guardias con cupo disponible y valor/hora >= $7500 (filter):", guardiasConCupoYBuenValor);

const resumenConPlus = guardiasDisponibles.map(g => ({
    id: g.id,
    sector: g.sector,
    valorBase: g.valorHora,
    valorConPlus10: Math.round(g.valorHora * 1.1)
}));
console.log("🔄 Listado transformado con plus del 10% (map):", resumenConPlus);

console.log("--- Catálogo de guardias ---");
guardiasDisponibles.forEach(g => {
    console.log(`ID ${g.id} | ${g.sector} | $${g.valorHora}/h | Cupos: ${g.cuposDisponibles}`);
});

let seguirSimulando = true;
const liquidacionesCargadas = [];

while (seguirSimulando) {
    let opcion = prompt(
        "Elegí una guardia para liquidar:\n" +
        "1 - Guardia Diurna ($6500/h)\n" +
        "2 - Guardia Nocturna / Feriado ($8500/h)\n" +
        "3 - Guardia de Refuerzo ($7500/h)\n" +
        "4 - Terapia Intensiva ($9200/h)\n" +
        "Escribí 'ESC' para finalizar."
    );

    if (opcion === null || opcion.toUpperCase() === "ESC") {
        seguirSimulando = false;
        break;
    }

    const guardiaSeleccionada = guardiasDisponibles.find(g => g.id === Number(opcion));

    if (!guardiaSeleccionada) {
        alert("⚠️ Opción no válida. Elegí un ID del 1 al 4 o escribí ESC.");
        continue;
    }

    const horasCargadas = pedirHoras(guardiaSeleccionada.sector);
    const montoTurno = guardiaSeleccionada.calcularLiquidacion(horasCargadas);

    guardiaSeleccionada.asignarCupo(1);
    mostrarResumenParcial(guardiaSeleccionada.sector, horasCargadas, montoTurno);

    liquidacionesCargadas.push({
        sector: guardiaSeleccionada.sector,
        horas: horasCargadas,
        subtotal: montoTurno
    });

    const respuesta = prompt("¿Querés cargar otra guardia? Escribí 'NO' para terminar.");
    if (respuesta && respuesta.toUpperCase() === "NO") {
        seguirSimulando = false;
    }
}

const totalGeneral = liquidacionesCargadas.reduce((acumulador, item) => acumulador + item.subtotal, 0);

console.log("========================================");
console.log("🧾 Liquidaciones cargadas:", liquidacionesCargadas);
console.log(`💵 Total acumulado a liquidar (reduce): $${totalGeneral}`);
console.log("========================================");
alert(`Simulación finalizada.\nTotal acumulado: $${totalGeneral}`);